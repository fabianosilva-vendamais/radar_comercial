from flask import Blueprint, request, jsonify
from ..services.empresa_service import EmpresaService

empresas_bp = Blueprint("api_empresas", __name__)


@empresas_bp.route("", methods=["GET"])
def list_empresas():
    p = request.args
    result = EmpresaService.list_all(
        responsavel=p.get("responsavel"),
        score_min=int(p["score_min"]) if "score_min" in p else None,
        score_max=int(p["score_max"]) if "score_max" in p else None,
        segmento=p.get("segmento"),
        q=p.get("q"),
        page=int(p.get("page", 1)),
        per_page=int(p.get("per_page", 100)),
    )
    return jsonify(result)


@empresas_bp.route("/<empresa_id>", methods=["GET"])
def get_empresa(empresa_id):
    empresa = EmpresaService.get_by_id(empresa_id)
    if not empresa:
        return jsonify({"error": "not found"}), 404
    return jsonify(empresa.to_dict())


@empresas_bp.route("", methods=["POST"])
def create_empresa():
    data = request.get_json(force=True)
    empresa = EmpresaService.upsert(data)
    return jsonify(empresa.to_dict()), 201


@empresas_bp.route("/<empresa_id>", methods=["PUT"])
def update_empresa(empresa_id):
    data = request.get_json(force=True)
    data["id"] = empresa_id
    empresa = EmpresaService.upsert(data)
    return jsonify(empresa.to_dict())


@empresas_bp.route("/<empresa_id>", methods=["PATCH"])
def patch_empresa(empresa_id):
    patch_data = request.get_json(force=True)
    empresa = EmpresaService.patch(empresa_id, patch_data)
    if not empresa:
        return jsonify({"error": "not found"}), 404
    return jsonify(empresa.to_dict())


@empresas_bp.route("/<empresa_id>", methods=["DELETE"])
def delete_empresa(empresa_id):
    ok = EmpresaService.delete(empresa_id)
    if not ok:
        return jsonify({"error": "not found"}), 404
    return "", 204


@empresas_bp.route("/bulk", methods=["POST"])
def bulk_upsert():
    """POST /api/empresas/bulk com { empresas: [...] } — usado pelo seed e importação futura."""
    body = request.get_json(force=True)
    items = body.get("empresas", [])
    results = [EmpresaService.upsert(e).to_dict() for e in items]
    return jsonify({"created": len(results), "items": results}), 201
