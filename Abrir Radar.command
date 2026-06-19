#!/bin/bash
# Abre o Radar Comercial via servidor local (evita restrições do file://)
cd "$(dirname "$0")"

# Mata servidor anterior se existir
fuser -k 8743/tcp 2>/dev/null || true
lsof -ti:8743 | xargs kill -9 2>/dev/null || true

echo "Iniciando servidor local na porta 8743..."
python3 -m http.server 8743 &
SERVER_PID=$!

sleep 1

echo "Abrindo no navegador..."
open "http://localhost:8743/Radar%20Comercial.html"

echo ""
echo "Radar Comercial rodando em http://localhost:8743/Radar%20Comercial.html"
echo "Pressione Ctrl+C para parar o servidor."
echo ""

wait $SERVER_PID
