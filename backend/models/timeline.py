import uuid
from ..extensions import db


class TimelineEntry(db.Model):
    __tablename__ = "timeline_entries"

    id = db.Column(db.String(64), primary_key=True,
                   default=lambda: str(uuid.uuid4()))
    empresa_id = db.Column(db.String(64), db.ForeignKey("empresas.id"),
                           nullable=False, index=True)
    data = db.Column(db.String(32))   # "Fev 2026" ou "YYYY-MM-DD"
    tipo = db.Column(db.String(64))   # "Proposta", "Follow-up", etc.
    texto = db.Column(db.Text)

    empresa = db.relationship("Empresa", back_populates="timeline")

    def to_dict(self) -> dict:
        return {"data": self.data, "tipo": self.tipo, "texto": self.texto}
