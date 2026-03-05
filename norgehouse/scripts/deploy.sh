#!/usr/bin/env bash
set -euo pipefail

# NorgeHouse deployment script
# Usage: ./scripts/deploy.sh [user@host] [path]

REMOTE_USER_HOST="${1:-root@your-droplet-ip}"
REMOTE_PATH="${2:-/var/www/norgehouse}"

echo "==> Deploying NorgeHouse to ${REMOTE_USER_HOST}:${REMOTE_PATH}"

ssh "${REMOTE_USER_HOST}" << ENDSSH
  set -euo pipefail

  echo "==> Pulling latest code..."
  cd "${REMOTE_PATH}"
  git pull origin main

  echo "==> Building and restarting containers..."
  docker compose up --build -d

  echo "==> Cleaning up old images..."
  docker system prune -af --filter "until=24h"

  echo "==> Health check..."
  sleep 5
  if curl -sf https://norgehouse.com > /dev/null; then
    echo "==> Deployment successful! Site is live."
  else
    echo "==> WARNING: Health check failed. Check container logs."
    docker compose logs --tail=50
    exit 1
  fi
ENDSSH
