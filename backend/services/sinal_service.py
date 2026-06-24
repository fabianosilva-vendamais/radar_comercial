from ..extensions import db
from ..models import Sinal, Empresa


def _tipo_peso(tipo: str) -> float:
    """Espelha tipoPeso() de ui.jsx."""
    t = (tipo or "").lower()
    if "executiv" in t:
        return 1.3
    if "crescimento" in t or "comercial" in t:
        return 1.2
    if "investimento" in t:
        return 1.2
    if "expans" in t:
        return 1.15
    if "estrateg" in t:
        return 1.1
    if "investigar" in t or "ia" in t:
        return 0.85
    return 0.7


def _sinal_impacto(sinal: Sinal) -> float:
    """Espelha sinalImpacto() de ui.jsx."""
    return _tipo_peso(sinal.tipo) * ((sinal.relevancia or 50) / 100) * 26


class SinalService:

    @staticmethod
    def list_recent(*, limit: int = 100) -> list[dict]:
        stmt = (
            db.select(Sinal)
            .join(Empresa, Sinal.empresa_id == Empresa.id)
            .order_by(Sinal.data.desc())
            .limit(limit)
        )
        sinais = db.session.execute(stmt).scalars().all()
        return [
            {**s.to_dict(), "empresa_nome": s.empresa.nome, "empresa_id": s.empresa_id}
            for s in sinais
        ]

    @staticmethod
    def validate(sinal_id: str, status: str) -> Sinal | None:
        """status: 'ok' | 'descartado' (espelha ui.jsx)."""
        sinal = db.session.get(Sinal, sinal_id)
        if not sinal:
            return None
        sinal.validado = status
        SinalService._recompute_score(sinal.empresa)
        db.session.commit()
        return sinal

    @staticmethod
    def _recompute_score(empresa: Empresa):
        """Espelha recomputeScore() de ui.jsx com retornos decrescentes."""
        base = empresa.score_base if empresa.score_base is not None else empresa.score
        confirmed = sorted(
            [_sinal_impacto(s) for s in empresa.sinais if s.validado == "ok"],
            reverse=True,
        )
        discarded = sorted(
            [_sinal_impacto(s) for s in empresa.sinais if s.validado == "descartado"],
            reverse=True,
        )
        adj = sum(v / (i + 1) for i, v in enumerate(confirmed))
        adj -= sum((v / (i + 1)) * 0.9 for i, v in enumerate(discarded))
        empresa.score = max(0, min(100, round(base + adj)))
        empresa.score_ajustado = bool(confirmed or discarded)
