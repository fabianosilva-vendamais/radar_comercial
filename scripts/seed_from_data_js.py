#!/usr/bin/env python3
"""
Migra as empresas do radar/data.js para o banco SQLite/PostgreSQL.

Uso (uma única vez):
    source .venv/bin/activate
    python scripts/seed_from_data_js.py
"""
import sys
import os
import re
import json

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

DATA_JS = os.path.join(os.path.dirname(__file__), "..", "radar", "data.js")


def _extract_balanced(src: str, start_marker: str) -> str:
    """Extrai o bloco JSON balanceado que começa após start_marker."""
    pos = src.find(start_marker)
    if pos < 0:
        raise RuntimeError(f"'{start_marker}' não encontrado em data.js")
    pos = src.index("[", pos + len(start_marker))
    depth = 0
    in_str = False
    escape = False
    for i, ch in enumerate(src[pos:], pos):
        if escape:
            escape = False
            continue
        if ch == "\\" and in_str:
            escape = True
            continue
        if ch == '"' and not in_str:
            in_str = True
            continue
        if ch == '"' and in_str:
            in_str = False
            continue
        if in_str:
            continue
        if ch == "[" or ch == "{":
            depth += 1
        elif ch == "]" or ch == "}":
            depth -= 1
            if depth == 0:
                return src[pos:i + 1]
    raise RuntimeError("Bloco não fechado em data.js")


def js_to_json(js: str) -> str:
    """
    Converte uma string de objeto JS para JSON válido.
    Limitações: não lida com template literals nem regex literais,
    mas é suficiente para os dados estáticos de data.js.
    """
    # Remove comentários de linha (// ...) fora de strings
    result = []
    in_str = False
    i = 0
    while i < len(js):
        ch = js[i]
        if ch == "\\" and in_str:
            result.append(ch)
            result.append(js[i + 1] if i + 1 < len(js) else "")
            i += 2
            continue
        if ch == '"' and not in_str:
            in_str = True
            result.append(ch)
            i += 1
            continue
        if ch == '"' and in_str:
            in_str = False
            result.append(ch)
            i += 1
            continue
        if not in_str and js[i:i+2] == "//":
            # Pula até fim de linha
            while i < len(js) and js[i] != "\n":
                i += 1
            continue
        result.append(ch)
        i += 1
    text = "".join(result)

    # Cita chaves não citadas: { key: → { "key":
    text = re.sub(
        r'([\{,]\s*)([A-Za-z_$][A-Za-z0-9_$]*)\s*:',
        lambda m: m.group(1) + '"' + m.group(2) + '":',
        text,
    )

    # Remove trailing commas antes de } ou ]
    text = re.sub(r",(\s*[}\]])", r"\1", text)

    return text


def extract_empresas(path: str) -> list[dict]:
    with open(path, "r", encoding="utf-8") as f:
        src = f.read()

    # Pega o bloco `empresas: [...]` do RADAR_DATA
    # Termina antes de gerarVolume() — exatamente as 9 contas reais
    block = _extract_balanced(src, "empresas:")
    json_str = js_to_json(block)

    try:
        return json.loads(json_str)
    except json.JSONDecodeError as exc:
        # Mostra contexto ao redor do erro para debug
        start = max(0, exc.pos - 60)
        end = min(len(json_str), exc.pos + 60)
        snippet = json_str[start:end]
        raise RuntimeError(
            f"Falha ao parsear JSON (pos={exc.pos}): {exc.msg}\n"
            f"Trecho: ...{snippet}..."
        )


def main():
    from backend import create_app
    from backend.extensions import db
    from backend.services.empresa_service import EmpresaService

    app = create_app("development")
    with app.app_context():
        db.create_all()

        empresas = extract_empresas(DATA_JS)
        print(f"Encontradas {len(empresas)} empresas em data.js")

        for i, emp in enumerate(empresas):
            emp.setdefault("proveniencia", {
                "tipo": "planilha",
                "arquivo": "Propostas perdidas em 2026.xlsx",
                "linha": i + 2,
                "nota": "Seed inicial do sistema",
            })
            emp.setdefault("validacao", {"status": "pendente"})

            result = EmpresaService.upsert(emp)
            print(f"  + {result.nome}  (score={result.score})")

        print(f"\nSeed concluído. {len(empresas)} empresas no banco.")


if __name__ == "__main__":
    main()
