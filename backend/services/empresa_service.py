import unicodedata
from ..extensions import db
from ..models import Empresa, Sinal, TimelineEntry


def _normalize(s: str) -> str:
    nfkd = unicodedata.normalize("NFD", (s or "").lower())
    return "".join(c for c in nfkd if not unicodedata.combining(c)).strip()


_FIELD_MAP = {
    "nome": "nome",
    "iniciais": "iniciais",
    "segmento": "segmento",
    "porte": "porte",
    "cidade": "cidade",
    "uf": "uf",
    "site": "site",
    "cnpj": "cnpj",
    "responsavel": "responsavel",
    "servico": "servico",
    "origem": "origem",
    "score": "score",
    "scoreBase": "score_base",
    "scoreAjustado": "score_ajustado",
    "iaScore": "ia_score",
    "scoreRationale": "score_rationale",
    "resumoSinal": "resumo_sinal",
    "motivo": "motivo",
    "novidade": "novidade",
    "ultimoRastreio": "ultimo_rastreio",
    "contato": "contato",
    "intencao": "intencao",
    "estrategia": "estrategia",
    "proveniencia": "proveniencia",
    "validacao": "validacao",
}


class EmpresaService:

    @staticmethod
    def list_all(*, responsavel: str = None, score_min: int = None,
                 score_max: int = None, segmento: str = None,
                 q: str = None, page: int = 1, per_page: int = 100) -> dict:
        stmt = db.select(Empresa)
        if responsavel:
            stmt = stmt.where(Empresa.responsavel == responsavel)
        if score_min is not None:
            stmt = stmt.where(Empresa.score >= score_min)
        if score_max is not None:
            stmt = stmt.where(Empresa.score <= score_max)
        if segmento:
            stmt = stmt.where(Empresa.segmento.ilike(f"%{segmento}%"))
        if q:
            like = f"%{q}%"
            stmt = stmt.where(
                db.or_(Empresa.nome.ilike(like), Empresa.cidade.ilike(like))
            )
        stmt = stmt.order_by(Empresa.score.desc())

        # Paginação manual (compatível com SQLAlchemy 2)
        total_stmt = db.select(db.func.count()).select_from(stmt.subquery())
        total = db.session.execute(total_stmt).scalar_one()
        offset = (page - 1) * per_page
        items = db.session.execute(stmt.offset(offset).limit(per_page)).scalars().all()
        pages = max(1, (total + per_page - 1) // per_page)

        return {
            "items": [e.to_dict() for e in items],
            "total": total,
            "page": page,
            "pages": pages,
        }

    @staticmethod
    def get_by_id(empresa_id: str) -> Empresa | None:
        return db.session.get(Empresa, empresa_id)

    @staticmethod
    def upsert(data: dict) -> Empresa:
        empresa_id = data.get("id")
        empresa: Empresa | None = None

        if empresa_id:
            empresa = db.session.get(Empresa, empresa_id)

        if empresa is None:
            normalized = _normalize(data.get("nome", ""))
            all_empresas = db.session.execute(db.select(Empresa)).scalars().all()
            for e in all_empresas:
                if _normalize(e.nome) == normalized:
                    empresa = e
                    break

        if empresa is None:
            empresa = Empresa()
            if empresa_id:
                empresa.id = empresa_id
            db.session.add(empresa)

        EmpresaService._apply_fields(empresa, data)

        if "sinais" in data:
            empresa.sinais = []
            db.session.flush()
            for s in (data["sinais"] or []):
                empresa.sinais.append(Sinal(
                    tipo=s.get("tipo"),
                    titulo=s.get("titulo"),
                    fonte=s.get("fonte"),
                    data=s.get("data"),
                    relevancia=s.get("relevancia", 0),
                    resumo=s.get("resumo"),
                    ia=s.get("ia", False),
                    query=s.get("query"),
                    validado=s.get("validado"),
                ))

        memoria = dict(data.get("memoria") or {})
        if "timeline" in memoria:
            empresa.timeline = []
            db.session.flush()
            for t in (memoria.pop("timeline") or []):
                empresa.timeline.append(TimelineEntry(
                    data=t.get("data"),
                    tipo=t.get("tipo"),
                    texto=t.get("texto"),
                ))
            empresa.memoria = memoria or empresa.memoria

        db.session.commit()
        return empresa

    @staticmethod
    def delete(empresa_id: str) -> bool:
        empresa = db.session.get(Empresa, empresa_id)
        if not empresa:
            return False
        db.session.delete(empresa)
        db.session.commit()
        return True

    @staticmethod
    def patch(empresa_id: str, patch_data: dict) -> Empresa | None:
        empresa = db.session.get(Empresa, empresa_id)
        if not empresa:
            return None
        EmpresaService._apply_fields(empresa, patch_data)
        db.session.commit()
        return empresa

    @staticmethod
    def _apply_fields(empresa: Empresa, data: dict):
        for js_key, py_attr in _FIELD_MAP.items():
            if js_key in data:
                setattr(empresa, py_attr, data[js_key])
