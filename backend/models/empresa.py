import uuid
from datetime import datetime, timezone
from ..extensions import db


class Empresa(db.Model):
    __tablename__ = "empresas"

    id = db.Column(db.String(64), primary_key=True,
                   default=lambda: str(uuid.uuid4()))
    nome = db.Column(db.String(256), nullable=False, index=True)
    iniciais = db.Column(db.String(8))
    segmento = db.Column(db.String(256))
    porte = db.Column(db.String(128))
    cidade = db.Column(db.String(128))
    uf = db.Column(db.String(4))
    site = db.Column(db.String(256))
    cnpj = db.Column(db.String(32))
    responsavel = db.Column(db.String(128), index=True)
    servico = db.Column(db.String(256))
    origem = db.Column(db.String(256))
    score = db.Column(db.Integer, nullable=False, default=0, index=True)
    score_base = db.Column(db.Integer)
    score_ajustado = db.Column(db.Boolean, default=False)
    ia_score = db.Column(db.Boolean, default=False)
    score_rationale = db.Column(db.Text)
    resumo_sinal = db.Column(db.Text)
    motivo = db.Column(db.Text)
    novidade = db.Column(db.Text)
    ultimo_rastreio = db.Column(db.String(32))

    # JSON blobs — nunca filtrados individualmente
    contato = db.Column(db.JSON)
    memoria = db.Column(db.JSON)    # todos os campos exceto timeline
    intencao = db.Column(db.JSON)
    estrategia = db.Column(db.JSON)
    proveniencia = db.Column(db.JSON)
    validacao = db.Column(db.JSON)

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime,
                           default=lambda: datetime.now(timezone.utc),
                           onupdate=lambda: datetime.now(timezone.utc))

    sinais = db.relationship(
        "Sinal", back_populates="empresa",
        cascade="all, delete-orphan",
        order_by="Sinal.data.desc()",
    )
    timeline = db.relationship(
        "TimelineEntry", back_populates="empresa",
        cascade="all, delete-orphan",
        order_by="TimelineEntry.data.desc()",
    )

    def to_dict(self) -> dict:
        """Reproduz o shape exato que o React espera (idêntico ao data.js)."""
        return {
            "id": self.id,
            "nome": self.nome,
            "iniciais": self.iniciais,
            "segmento": self.segmento,
            "porte": self.porte,
            "cidade": self.cidade,
            "uf": self.uf,
            "site": self.site,
            "cnpj": self.cnpj,
            "contato": self.contato or {},
            "responsavel": self.responsavel,
            "servico": self.servico,
            "origem": self.origem,
            "score": self.score,
            "scoreBase": self.score_base,
            "scoreAjustado": self.score_ajustado,
            "iaScore": self.ia_score,
            "scoreRationale": self.score_rationale,
            "resumoSinal": self.resumo_sinal,
            "motivo": self.motivo,
            "novidade": self.novidade,
            "ultimoRastreio": self.ultimo_rastreio,
            "sinais": [s.to_dict() for s in self.sinais],
            "memoria": self._build_memoria(),
            "intencao": self.intencao or {},
            "estrategia": self.estrategia or {},
            "proveniencia": self.proveniencia or {},
            "validacao": self.validacao or {},
        }

    def _build_memoria(self) -> dict:
        base = dict(self.memoria or {})
        base["timeline"] = [t.to_dict() for t in self.timeline]
        return base
