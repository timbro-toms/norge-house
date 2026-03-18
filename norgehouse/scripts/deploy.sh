#!/usr/bin/env bash
set -euo pipefail

# NorgeHouse deployment script
# Usage: ./scripts/deploy.sh [user@host]

REMOTE_USER_HOST="${1:-root@your-droplet-ip}"
REMOTE_PATH="/opt/norgehouse/norgehouse"

echo "==> Deploying NorgeHouse to ${REMOTE_USER_HOST}:${REMOTE_PATH}"

ssh "${REMOTE_USER_HOST}" << ENDSSH
  set -euo pipefail

  echo "==> Pulling latest code..."
  cd "${REMOTE_PATH}"
  git pull origin main

  echo "==> Building and restarting containers..."
  docker compose -f docker-compose.prod.yml up --build -d

  echo "==> Cleaning up old images..."
  docker system prune -af --filter "until=24h"

  echo "==> Health check..."
  sleep 10
  if curl -sf http://localhost:3000 > /dev/null; then
    echo "✓ Deploy OK — site is live"
  else
    echo "✗ Health check failed. Check logs:"
    docker compose -f docker-compose.prod.yml logs --tail=20
    exit 1
  fi
ENDSSH
