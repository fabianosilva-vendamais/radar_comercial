import os
from flask import Flask, send_from_directory
from .extensions import db, migrate, cors
from .config import CONFIG_MAP


def create_app(env: str = None) -> Flask:
    env = env or os.environ.get("FLASK_ENV", "development")
    cfg = CONFIG_MAP.get(env, CONFIG_MAP["development"])

    if hasattr(cfg, "fix_db_url"):
        cfg.fix_db_url()

    app = Flask(__name__, static_folder=None)
    app.config.from_object(cfg)

    # Inicializa extensões
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    # Importa modelos para que o Flask-Migrate os enxergue
    from .models import Empresa, Sinal, TimelineEntry, Rastreio  # noqa: F401

    # Registra blueprints
    from .routes.pages import pages_bp
    from .routes.empresas import empresas_bp
    from .routes.sinais import sinais_bp
    from .routes.ai import ai_bp
    from .routes.rastreios import rastreios_bp

    app.register_blueprint(pages_bp)
    app.register_blueprint(empresas_bp, url_prefix="/api/empresas")
    app.register_blueprint(sinais_bp, url_prefix="/api/sinais")
    app.register_blueprint(ai_bp, url_prefix="/api")
    app.register_blueprint(rastreios_bp, url_prefix="/api/rastreios")

    # Serve os arquivos .jsx, .css e assets do React
    @app.route("/radar/<path:filename>")
    def radar_static(filename):
        return send_from_directory(cfg.STATIC_RADAR, filename)

    return app
