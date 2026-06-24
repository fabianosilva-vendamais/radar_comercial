from datetime import datetime, timezone
from flask import Blueprint, request, jsonify, current_app
from ..extensions import db
from ..models import Rastreio, Empresa
from ..services.worker_service import lancar_rastreio

rastreios_bp = Blueprint("rastreios", __name__)


@rastreios_bp.post("/")
def criar_rastreio():
    """
    POST /api/rastreios
    Body: { "escopo": "todas" | "empresa", "empresa_id": "<uuid>" }
    Retorna: { "id": "...", "status": "na_fila" } imediatamente.
    """
    body = request.get_json(silent=True) or {}
    escopo = body.get("escopo", "todas")
    empresa_id = body.get("empresa_id")

    if escopo == "empresa":
        if not empresa_id:
            return jsonify({"error": "empresa_id obrigatório para escopo='empresa'"}), 400
        if not db.session.get(Empresa, empresa_id):
            return jsonify({"error": "empresa não encontrada"}), 404

    rastreio = Rastreio(
        escopo=escopo,
        empresa_id=empresa_id,
        status="na_fila",
        progresso=0,
        processadas=0,
        iniciado_em=datetime.now(timezone.utc),
    )
    db.session.add(rastreio)
    db.session.commit()

    lancar_rastreio(current_app._get_current_object(), rastreio.id)

    return jsonify(rastreio.to_dict()), 202


@rastreios_bp.get("/<rastreio_id>")
def obter_rastreio(rastreio_id: str):
    """
    GET /api/rastreios/:id
    Retorna: { id, status, progresso, processadas, total, erro_msg, ... }
    """
    rastreio = db.session.get(Rastreio, rastreio_id)
    if not rastreio:
        return jsonify({"error": "rastreio não encontrado"}), 404
    return jsonify(rastreio.to_dict())
