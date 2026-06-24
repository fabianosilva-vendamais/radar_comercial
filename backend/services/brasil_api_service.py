"""
BrasilAPI — enriquecimento de CNPJ (gratuito, sem chave).
Endpoint: GET https://brasilapi.com.br/api/cnpj/v1/{cnpj}
"""
import re
import requests

_BASE = "https://brasilapi.com.br/api/cnpj/v1"
_TIMEOUT = 10


def _limpar_cnpj(cnpj: str) -> str:
    return re.sub(r"\D", "", cnpj or "")


def enriquecer_por_cnpj(cnpj: str) -> dict | None:
    """
    Consulta a BrasilAPI e retorna um dict com campos prontos para
    atualizar a Empresa. Retorna None em caso de erro ou CNPJ inválido.
    """
    cnpj_limpo = _limpar_cnpj(cnpj)
    if len(cnpj_limpo) != 14:
        return None

    try:
        resp = requests.get(f"{_BASE}/{cnpj_limpo}", timeout=_TIMEOUT)
        if resp.status_code != 200:
            return None
        data = resp.json()
    except Exception:
        return None

    return {
        "nome_oficial": data.get("razao_social") or data.get("nome_fantasia"),
        "cnae_descricao": data.get("cnae_fiscal_descricao"),
        "situacao_cadastral": data.get("descricao_situacao_cadastral"),
        "capital_social": data.get("capital_social"),
        "municipio": data.get("municipio"),
        "uf": data.get("uf"),
        "data_abertura": data.get("data_inicio_atividade"),
        "fonte": "BrasilAPI / Receita Federal",
        "url": f"https://brasilapi.com.br/api/cnpj/v1/{cnpj_limpo}",
    }
