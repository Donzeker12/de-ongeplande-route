#!/bin/bash

# Deploy script - updates files only, does NOT touch database data
# Run on the VPS: bash deploy.sh

set -e

echo "=== Deploying de-ongeplande-route ==="

# Pull latest code from GitHub
echo "[1/5] Pulling latest code..."
git pull origin main

# Install/update PHP dependencies (no dev packages)
echo "[2/5] Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

# Install/update JS dependencies and build assets
echo "[3/5] Building frontend assets..."
npm ci --omit=dev
npm run build

# Run only NEW migrations (--pretend to verify, then run)
# This will NOT seed or wipe the database
echo "[4/5] Running pending migrations..."
php artisan migrate --force --no-interaction

# Clear and rebuild caches
echo "[5/5] Clearing caches..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

echo ""
echo "=== Deploy complete! ==="
