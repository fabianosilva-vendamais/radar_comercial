"""
Worker assíncrono para o Agente 3 (Radar externo).
Roda em thread separada com app_context do Flask.

Pipeline por empresa:
  0. BrasilAPI  — enriquece campos cadastrais se houver CNPJ
  1. CNPJá      — enriquecimento extra (sócios, situação detalhada) se houver CNPJ
  2. GNews      — busca notícias → Sinais com status='verificado'
  3. InfoJobs   — vagas comerciais abertas
  5. OpenAI     — scoring + estratégia (ai_service.empresa_strategy)
"""
import threading
import uuid
from datetime import datetime, timezone

from ..extensions import db
from ..models import Empresa, Sinal, Rastreio
from .brasil_api_service import enriquecer_por_cnpj as brasil_enriquecer
from .cnpja_service import enriquecer_por_cnpj as cnpja_enriquecer
from .gnews_service import buscar_noticias
from .infojobs_service import buscar_vagas
from .ai_service import AIService


def lancar_rastreio(app, rastreio_id: str) -> None:
    """Lança a thread do worker. Não bloqueia."""
    t = threading.Thread(
        target=_executar,
        args=(app, rastreio_id),
        daemon=True,
        name=f"worker-rastreio-{rastreio_id[:8]}",
    )
    t.start()


def _executar(app, rastreio_id: str) -> None:
    with app.app_context():
        rastreio = db.session.get(Rastreio, rastreio_id)
        if not rastreio:
            return

        try:
            rastreio.status = "rodando"
            db.session.commit()

            empresas = _selecionar_empresas(rastreio)
            rastreio.total = len(empresas)
            rastreio.processadas = 0
            db.session.commit()

            for empresa in empresas:
                try:
                    _processar_empresa(app, empresa)
                except Exception as exc:
                    app.logger.error(
                        "worker: erro em %s — %s", empresa.nome, exc, exc_info=True
                    )
                finally:
                    rastreio.processadas += 1
                    rastreio.progresso = int(rastreio.processadas / rastreio.total * 100)
                    db.session.commit()

            rastreio.status = "concluido"
            rastreio.terminado_em = datetime.now(timezone.utc)

        except Exception as exc:
            app.logger.error("worker: falha crítica — %s", exc, exc_info=True)
            rastreio.status = "erro"
            rastreio.erro_msg = str(exc)
            rastreio.terminado_em = datetime.now(timezone.utc)

        finally:
            db.session.commit()


def _selecionar_empresas(rastreio: Rastreio) -> list[Empresa]:
    if rastreio.escopo == "empresa" and rastreio.empresa_id:
        e = db.session.get(Empresa, rastreio.empresa_id)
        return [e] if e else []
    return db.session.execute(
        db.select(Empresa).order_by(Empresa.score.desc())
    ).scalars().all()


def _processar_empresa(app, empresa: Empresa) -> None:
    # 0. BrasilAPI — enriquecimento cadastral básico
    if empresa.cnpj:
        try:
            dados = brasil_enriquecer(empresa.cnpj)
            if dados:
                if not empresa.cidade and dados.get("municipio"):
                    empresa.cidade = dados["municipio"].title()
                if not empresa.uf and dados.get("uf"):
                    empresa.uf = dados["uf"]
                db.session.flush()
        except Exception as exc:
            app.logger.warning("brasilapi: erro para %s — %s", empresa.nome, exc)

    # 1. CNPJá — enriquecimento extra (sócios, situação detalhada)
    if empresa.cnpj:
        try:
            dados_extra = cnpja_enriquecer(empresa.cnpj)
            if dados_extra:
                if not empresa.cidade and dados_extra.get("municipio"):
                    empresa.cidade = dados_extra["municipio"].title()
                if not empresa.uf and dados_extra.get("uf"):
                    empresa.uf = dados_extra["uf"]
                db.session.flush()
        except Exception as exc:
            app.logger.warning("cnpja: erro para %s — %s", empresa.nome, exc)

    # 2. GNews — notícias → sinais verificados
    try:
        noticias = buscar_noticias(empresa.nome)
        for n in noticias:
            if not n.get("url"):
                continue
            # evita duplicatas pela URL
            ja_existe = db.session.execute(
                db.select(Sinal).where(
                    Sinal.empresa_id == empresa.id,
                    Sinal.url == n["url"],
                )
            ).scalar_one_or_none()
            if ja_existe:
                continue
            sinal = Sinal(
                id=str(uuid.uuid4()),
                empresa_id=empresa.id,
                tipo=n["tipo"],
                titulo=n["titulo"],
                resumo=n.get("resumo"),
                fonte=n["fonte"],
                url=n["url"],
                data=n["data"],
                relevancia=n.get("relevancia", 60),
                ia=False,
                status="verificado",
            )
            db.session.add(sinal)
        db.session.flush()
    except Exception as exc:
        app.logger.warning("gnews: erro para %s — %s", empresa.nome, exc)

    # 3. InfoJobs — vagas comerciais abertas
    try:
        vagas = buscar_vagas(empresa.nome)
        for v in vagas:
            if not v.get("url"):
                continue
            ja_existe = db.session.execute(
                db.select(Sinal).where(
                    Sinal.empresa_id == empresa.id,
                    Sinal.url == v["url"],
                )
            ).scalar_one_or_none()
            if ja_existe:
                continue
            sinal = Sinal(
                id=str(uuid.uuid4()),
                empresa_id=empresa.id,
                tipo=v["tipo"],
                titulo=v["titulo"],
                resumo=v.get("resumo"),
                fonte=v["fonte"],
                url=v["url"],
                data=v["data"],
                relevancia=v.get("relevancia", 75),
                ia=False,
                status="verificado",
            )
            db.session.add(sinal)
        db.session.flush()
    except Exception as exc:
        app.logger.warning("infojobs: erro para %s — %s", empresa.nome, exc)

    # 5. OpenAI — score + estratégia
    try:
        ai = AIService()
        result = ai.empresa_strategy(empresa.to_dict())
        if result.get("score") is not None:
            empresa.score = result["score"]
            empresa.ia_score = True
        if result.get("scoreRationale"):
            empresa.score_rationale = result["scoreRationale"]
        if result.get("intencao"):
            empresa.intencao = result["intencao"]
        if result.get("estrategia"):
            empresa.estrategia = result["estrategia"]
    except Exception as exc:
        app.logger.warning("openai: erro para %s — %s", empresa.nome, exc)

    empresa.ultimo_rastreio = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    db.session.flush()
