#!/usr/bin/env bash
set -euo pipefail

# NorgeHouse — First-time droplet setup
# Run on the server: bash scripts/setup-droplet.sh
#
# Prerequisites:
#   - Docker already installed (existing n8n setup)
#   - Caddy already running as reverse proxy
#   - DNS A record for wooden-houses.linden.lv → droplet IP

INSTALL_DIR="/opt/norgehouse"
REPO_URL="https://github.com/timbro-toms/norge-house.git"

echo "==> Setting up NorgeHouse at ${INSTALL_DIR}"

# Clone repo if not already present
if [ ! -d "${INSTALL_DIR}" ]; then
  git clone "${REPO_URL}" "${INSTALL_DIR}"
else
  echo "    Directory exists, pulling latest..."
  cd "${INSTALL_DIR}"
  git pull origin main
fi

cd "${INSTALL_DIR}/norgehouse"

# Create .env if not present
if [ ! -f .env ]; then
  echo "==> Creating .env from template..."
  cp .env.production .env

  # Generate random secrets
  PG_PASS=$(openssl rand -base64 24 | tr -d '/+=' | head -c 32)
  PL_SECRET=$(openssl rand -base64 32 | tr -d '/+=' | head -c 32)

  sed -i "s/CHANGE_ME_STRONG_PASSWORD/${PG_PASS}/" .env
  sed -i "s/CHANGE_ME_32_CHAR_RANDOM_STRING/${PL_SECRET}/" .env

  echo "    .env created with generated secrets"
  echo "    ⚠ Review and edit .env if needed: nano ${INSTALL_DIR}/norgehouse/.env"
else
  echo "    .env already exists, skipping"
fi

echo "==> Building and starting containers..."
docker compose -f docker-compose.prod.yml up --build -d

echo "==> Waiting for services to start..."
sleep 10

# Health check
if curl -sf http://localhost:3000 > /dev/null 2>&1; then
  echo "✓ Web app is running on port 3000"
else
  echo "✗ Web app not responding yet (may still be starting)"
  echo "  Check logs: docker compose -f docker-compose.prod.yml logs -f web"
fi

if curl -sf http://localhost:3001/admin > /dev/null 2>&1; then
  echo "✓ CMS is running on port 3001"
else
  echo "✗ CMS not responding yet (may still be starting)"
  echo "  Check logs: docker compose -f docker-compose.prod.yml logs -f cms"
fi

echo ""
echo "==> Next steps:"
echo "  1. Add Caddy config (see scripts/caddy-norgehouse.txt)"
echo "  2. Reload Caddy: docker exec <caddy-container> caddy reload --config /etc/caddy/Caddyfile"
echo "  3. Visit https://wooden-houses.linden.lv"
echo ""
echo "==> To deploy updates later:"
echo "  cd ${INSTALL_DIR}/norgehouse && git pull origin main && docker compose -f docker-compose.prod.yml up --build -d"
