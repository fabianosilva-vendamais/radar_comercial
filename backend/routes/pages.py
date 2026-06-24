from flask import Blueprint, send_from_directory, current_app

pages_bp = Blueprint("pages", __name__)


@pages_bp.route("/")
def index():
    return send_from_directory(current_app.config["STATIC_PUBLIC"], "index.html")


@pages_bp.route("/<path:path>")
def catch_all(path):
    """
    Tenta servir o arquivo pedido de /public; cai no index.html para
    rotas client-side que não existem como arquivo real.
    """
    pub = current_app.config["STATIC_PUBLIC"]
    try:
        return send_from_directory(pub, path)
    except Exception:
        return send_from_directory(pub, "index.html")
