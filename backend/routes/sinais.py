from flask import Blueprint, request, jsonify
from ..services.sinal_service import SinalService

sinais_bp = Blueprint("api_sinais", __name__)


@sinais_bp.route("", methods=["GET"])
def list_sinais():
    limit = int(request.args.get("limit", 100))
    return jsonify(SinalService.list_recent(limit=limit))


@sinais_bp.route("/<sinal_id>/validar", methods=["PATCH"])
def validar_sinal(sinal_id):
    """
    PATCH /api/sinais/<id>/validar  com { "status": "ok" | "descartado" }
    Valida o sinal e recomputa o score da empresa.
    """
    body = request.get_json(force=True)
    status = body.get("status")
    if status not in ("ok", "descartado"):
        return jsonify({"error": "status deve ser 'ok' ou 'descartado'"}), 400
    sinal = SinalService.validate(sinal_id, status)
    if not sinal:
        return jsonify({"error": "not found"}), 404
    return jsonify(sinal.to_dict())
