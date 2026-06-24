import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent  # raiz do repo


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-change-me")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
    OPENAI_MODEL = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
    GNEWS_API_KEY = os.environ.get("GNEWS_API_KEY", "")
    CNPJA_API_KEY = os.environ.get("CNPJA_API_KEY", "")
    INFOJOBS_CLIENT_ID = os.environ.get("INFOJOBS_CLIENT_ID", "")
    INFOJOBS_CLIENT_SECRET = os.environ.get("INFOJOBS_CLIENT_SECRET", "")
    STATIC_PUBLIC = BASE_DIR / "public"
    STATIC_RADAR = BASE_DIR / "radar"


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        f"sqlite:///{BASE_DIR / 'radar_dev.db'}",
    )


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "")

    @classmethod
    def fix_db_url(cls):
        url = cls.SQLALCHEMY_DATABASE_URI or ""
        if url.startswith("postgres://"):
            cls.SQLALCHEMY_DATABASE_URI = url.replace("postgres://", "postgresql://", 1)


CONFIG_MAP = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
}
