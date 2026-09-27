#!/usr/bin/env bash
set -euo pipefail

trap 'echo "Deployment failed. Check the output above for the failing step."' ERR

echo "Step 1/6: Pulling latest code from origin/main..."
git pull --ff-only origin main

echo "Step 2/6: Checking for .env.production..."
if [ ! -f ".env.production" ]; then
  echo "Missing .env.production."
  echo "Create it manually on the server before deploying. See README-DEPLOY.md for required variables."
  exit 1
fi

echo "Step 3/6: Building Docker image..."
docker compose --env-file .env.production config --quiet
docker compose --env-file .env.production build --pull

echo "Step 4/6: Starting HammerLoad container..."
docker compose --env-file .env.production up -d --wait --wait-timeout 90

echo "Step 5/6: Current container status..."
docker compose --env-file .env.production ps

echo "Step 6/6: Last 20 log lines..."
docker compose --env-file .env.production logs --tail=20

echo "Deployment finished successfully."
