import uuid
from datetime import datetime, timezone
from ..extensions import db


class Rastreio(db.Model):
    __tablename__ = "rastreios"

    id = db.Column(db.String(64), primary_key=True,
                   default=lambda: str(uuid.uuid4()))
    escopo = db.Column(db.String(16))          # "empresa" | "todas"
    empresa_id = db.Column(db.String(64))      # preenchido quando escopo="empresa"
    status = db.Column(db.String(16), nullable=False, default="na_fila")
    progresso = db.Column(db.Integer, nullable=False, default=0)
    total = db.Column(db.Integer)
    processadas = db.Column(db.Integer, nullable=False, default=0)
    erro_msg = db.Column(db.Text)
    iniciado_em = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    terminado_em = db.Column(db.DateTime)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "escopo": self.escopo,
            "empresa_id": self.empresa_id,
            "status": self.status,
            "progresso": self.progresso,
            "total": self.total,
            "processadas": self.processadas,
            "erro_msg": self.erro_msg,
            "iniciado_em": self.iniciado_em.isoformat() if self.iniciado_em else None,
            "terminado_em": self.terminado_em.isoformat() if self.terminado_em else None,
        }
