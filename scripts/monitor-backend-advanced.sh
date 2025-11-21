#!/bin/bash

echo "$(date) - Script foi executado com sucesso" >> /var/www/projeto/fullstack-mern/scripts/monitor-backend.log

# Configurações
PORT=4000
PROCESS_NAME="backend"
LOG_FILE="/var/www/projeto/fullstack-mern/scripts/monitor-backend.log"

# Lista de rotas críticas
ROUTES=(
 "/api/user",
 "/api/product",
 "/api/vendor",
 "/api/banner",
 "/api/hero",
 "/api/cards",
 "/api/logo",
 "/api/footer",
 "/api/home-section",
 "/api/features",
 "/api/dashboard",
 "/api/sections",
 "/api/about-section",
 "/api/services-section",
 "/api/about-banner",
 "/api/certification-section",
 "/api/newsletter",
 "/api/faqs",
 "/api/pages",
)

# Função para testar uma rota
check_route() {
  local route=$1
  if ! curl -s http://localhost:$PORT$route > /dev/null; then
    echo "$(date) - ❌ Falha na rota $route" >> $LOG_FILE
    return 1
  fi
  return 0
}

# Testa todas as rotas
for route in "${ROUTES[@]}"; do
  check_route $route
  if [ $? -ne 0 ]; then
    echo "$(date) - 🔄 Reiniciando backend..." >> $LOG_FILE
    pm2 restart $PROCESS_NAME
    pm2 save
    exit 0
  fi
done

echo "$(date) - ✅ Todas as rotas online" >> $LOG_FILE
