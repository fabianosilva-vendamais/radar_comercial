#!/usr/bin/env bash
set -e

# Aplica as migrations do banco (cria/atualiza as tabelas).
# Se ainda não houver DATABASE_URL configurada, isto vai falhar — configure
# a variável de ambiente no Dokploy apontando para o Postgres.
echo ">> Aplicando migrations..."
flask db upgrade

# Sobe o servidor de produção.
echo ">> Iniciando gunicorn na porta ${PORT:-8000}..."
exec gunicorn wsgi:app \
    --bind "0.0.0.0:${PORT:-8000}" \
    --workers 2 \
    --timeout 120
