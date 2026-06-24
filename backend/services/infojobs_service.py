"""
InfoJobs Brasil — vagas como sinal de crescimento comercial (freemium).
Cadastro em: https://developer.infojobs.com.br
Auth: Basic base64(client_id:client_secret)
Endpoint: GET https://api.infojobs.com.br/api/4/offer
"""
import base64
import requests
from datetime import datetime, timezone
from flask import current_app

_BASE = "https://api.infojobs.com.br"
_TIMEOUT = 10

# Termos comerciais que indicam expansão de time de vendas
_TERMOS_COMERCIAIS = ["SDR", "vendedor", "gerente comercial", "diretor comercial", "executivo de vendas", "account"]


def buscar_vagas(nome_empresa: str) -> list[dict]:
    """
    Busca vagas abertas na empresa e retorna lista de dicts
    prontos para criar Sinal com status='verificado'.
    Retorna [] se credenciais ausentes ou qualquer erro.
    """
    client_id = current_app.config.get("INFOJOBS_CLIENT_ID", "")
    client_secret = current_app.config.get("INFOJOBS_CLIENT_SECRET", "")
    if not client_id or not client_secret:
        return []

    token = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
    headers = {"Authorization": f"Basic {token}"}

    sinais = []
    for termo in _TERMOS_COMERCIAIS:
        try:
            resp = requests.get(
                f"{_BASE}/api/4/offer",
                params={"q": f'{nome_empresa} {termo}', "maxResults": 3},
                headers=headers,
                timeout=_TIMEOUT,
            )
            if resp.status_code != 200:
                continue
            for vaga in resp.json().get("offers", []):
                url = vaga.get("link") or vaga.get("url", "")
                if not url:
                    continue
                # evita duplicatas de URL dentro do mesmo lote
                if any(s["url"] == url for s in sinais):
                    continue
                pub = vaga.get("publicationDate", "")
                data_str = pub[:10] if pub else datetime.now(timezone.utc).strftime("%Y-%m-%d")
                titulo = vaga.get("title", termo)
                sinais.append({
                    "tipo": "Crescimento comercial",
                    "titulo": f"Vaga: {titulo}",
                    "resumo": f"{nome_empresa} está contratando {titulo} — sinal de expansão do time comercial.",
                    "fonte": "InfoJobs Brasil",
                    "url": url,
                    "data": data_str,
                    "relevancia": 75,
                    "ia": False,
                    "status": "verificado",
                })
        except Exception:
            continue

    return sinais
