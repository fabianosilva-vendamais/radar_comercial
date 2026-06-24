"""
GNews — busca de notícias em PT/BR (freemium, 100 req/dia no plano gratuito).
Registre em https://gnews.io e adicione GNEWS_API_KEY ao .env
Endpoint: GET https://gnews.io/api/v4/search
"""
from datetime import datetime, timezone
import requests
from flask import current_app

_BASE = "https://gnews.io/api/v4/search"
_TIMEOUT = 10
_MAX_ARTICLES = 5


def buscar_noticias(nome_empresa: str) -> list[dict]:
    """
    Busca notícias recentes sobre a empresa e retorna lista de dicts
    prontos para criar Sinal com status='verificado'.
    Retorna [] se a chave estiver ausente ou ocorrer qualquer erro.
    """
    api_key = current_app.config.get("GNEWS_API_KEY", "")
    if not api_key:
        return []

    params = {
        "q": f'"{nome_empresa}"',
        "lang": "pt",
        "country": "br",
        "max": _MAX_ARTICLES,
        "token": api_key,
    }

    try:
        resp = requests.get(_BASE, params=params, timeout=_TIMEOUT)
        if resp.status_code != 200:
            return []
        data = resp.json()
    except Exception:
        return []

    sinais = []
    for art in data.get("articles", []):
        pub_raw = art.get("publishedAt", "")
        data_str = pub_raw[:10] if pub_raw else datetime.now(timezone.utc).strftime("%Y-%m-%d")
        sinais.append({
            "tipo": "Notícia / Mídia",
            "titulo": art.get("title", "")[:512],
            "resumo": art.get("description") or art.get("content", "")[:500],
            "fonte": art.get("source", {}).get("name") or "GNews",
            "url": art.get("url", ""),
            "data": data_str,
            "relevancia": 60,
            "ia": False,
            "status": "verificado",
        })

    return sinais
