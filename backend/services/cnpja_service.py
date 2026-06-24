"""
CNPJá — enriquecimento por CNPJ (freemium, plano grátis disponível).
Cadastro em: https://cnpja.com

IMPORTANTE: busca por nome é feature PAGA no CNPJá.
Este serviço faz lookup por CNPJ, retornando dados extras além do BrasilAPI:
sócios, quadro societário, situação detalhada, filiais.

Endpoint: GET https://api.cnpja.com/office/{cnpj}
Auth: header Authorization: {api_key}  (sem prefixo "Bearer")
"""
import re
import requests
from flask import current_app

_BASE = "https://api.cnpja.com"
_TIMEOUT = 10


def _limpar_cnpj(cnpj: str) -> str:
    return re.sub(r"\D", "", cnpj or "")


def enriquecer_por_cnpj(cnpj: str) -> dict | None:
    """
    Enriquece dados de uma empresa usando o CNPJá (requer CNPJ).
    Retorna dict com campos extras ou None em caso de erro.
    """
    api_key = current_app.config.get("CNPJA_API_KEY", "")
    if not api_key:
        return None

    cnpj_limpo = _limpar_cnpj(cnpj)
    if len(cnpj_limpo) != 14:
        return None

    try:
        resp = requests.get(
            f"{_BASE}/office/{cnpj_limpo}",
            headers={"Authorization": api_key},
            timeout=_TIMEOUT,
        )
        if resp.status_code != 200:
            return None
        data = resp.json()
    except Exception:
        return None

    company = data.get("company") or {}
    socios = [
        m.get("name") for m in (company.get("members") or [])
        if m.get("name")
    ]

    return {
        "nome_oficial": company.get("name"),
        "situacao_cadastral": (data.get("status") or {}).get("text"),
        "capital_social": company.get("equity"),
        "municipio": (data.get("city") or {}).get("name"),
        "uf": (data.get("state") or {}).get("code"),
        "socios": socios[:3],
        "fonte": "CNPJá / Receita Federal",
        "url": f"https://cnpja.com/office/{cnpj_limpo}",
    }
