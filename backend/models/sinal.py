import uuid
from ..extensions import db


class Sinal(db.Model):
    __tablename__ = "sinais"

    id = db.Column(db.String(64), primary_key=True,
                   default=lambda: str(uuid.uuid4()))
    empresa_id = db.Column(db.String(64), db.ForeignKey("empresas.id"),
                           nullable=False, index=True)
    tipo = db.Column(db.String(128))
    titulo = db.Column(db.String(512))
    fonte = db.Column(db.String(128))
    data = db.Column(db.String(16))        # "YYYY-MM-DD"
    relevancia = db.Column(db.Integer, default=0)
    resumo = db.Column(db.Text)
    ia = db.Column(db.Boolean, default=False)
    query = db.Column(db.Text)
    # "ok" | "descartado" | null  (validação humana, espelha ui.jsx)
    validado = db.Column(db.String(16))
    # URL da fonte original — obrigatório para status "verificado"
    url = db.Column(db.Text)
    # "a_verificar" | "verificado" | "descartado"  (confiança da máquina)
    status = db.Column(db.String(16), nullable=False, default="a_verificar")

    empresa = db.relationship("Empresa", back_populates="sinais")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "tipo": self.tipo,
            "titulo": self.titulo,
            "fonte": self.fonte,
            "data": self.data,
            "relevancia": self.relevancia,
            "resumo": self.resumo,
            "ia": self.ia,
            "query": self.query,
            "validado": self.validado,
            "url": self.url,
            "status": self.status,
        }
