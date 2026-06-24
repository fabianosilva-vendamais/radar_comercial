import logging
from flask import Blueprint, request, jsonify, current_app
from ..services.ai_service import AIService

logger = logging.getLogger(__name__)
ai_bp = Blueprint("api_ai", __name__)
_svc = AIService()


@ai_bp.route("/health", methods=["GET"])
def health():
    """GET /api/health — diagnóstico rápido sem chamar a OpenAI."""
    has_key = bool(current_app.config.get("OPENAI_API_KEY"))
    return jsonify({
        "status": "ok" if has_key else "sem_chave",
        "openai_key_configured": has_key,
        "model": current_app.config.get("OPENAI_MODEL"),
    })


@ai_bp.route("/chat", methods=["POST"])
def chat():
    """
    Substitui api/chat.js. O openai-bridge.js chama POST /api/chat com:
      { model, messages, max_tokens, temperature }
    Retorna a resposta crua do OpenAI — mesmo shape da versão Node.
    """
    body = request.get_json(force=True, silent=True) or {}
    model = body.get("model", current_app.config["OPENAI_MODEL"])
    messages = body.get("messages", [])
    max_tokens = int(body.get("max_tokens", 2048))
    temperature = float(body.get("temperature", 0.7))

    if not current_app.config.get("OPENAI_API_KEY"):
        return jsonify({"error": "OPENAI_API_KEY não configurado"}), 500

    try:
        result = _svc.chat_completion(
            model=model,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature,
        )
        return jsonify(result)
    except Exception as exc:
        logger.error("/api/chat error: %s", exc)
        return jsonify({"error": str(exc)}), 500


@ai_bp.route("/ai/estrategia/<empresa_id>", methods=["POST"])
def estrategia(empresa_id):
    """
    Chamada server-side do Agente 3 — enriquece e persiste a empresa.
    POST /api/ai/estrategia/<id>
    """
    from ..services.empresa_service import EmpresaService
    empresa = EmpresaService.get_by_id(empresa_id)
    if not empresa:
        return jsonify({"error": "not found"}), 404
    try:
        result = _svc.empresa_strategy(empresa.to_dict())
        updated = EmpresaService.patch(empresa_id, {
            "score": result.get("score", empresa.score),
            "scoreRationale": result.get("scoreRationale"),
            "intencao": result.get("intencao", empresa.intencao),
            "estrategia": {**(empresa.estrategia or {}), **(result.get("estrategia") or {})},
        })
        return jsonify(updated.to_dict())
    except Exception as exc:
        logger.error("/api/ai/estrategia error: %s", exc)
        return jsonify({"error": str(exc)}), 500
