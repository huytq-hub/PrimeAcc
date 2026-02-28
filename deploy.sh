#!/bin/bash

# PrimeAcc Simple Deployment Script
# Usage: ./deploy.sh

set -e

echo "🚀 Deploying PrimeAcc..."
echo ""

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "❌ .env.production not found!"
    echo "Create it: cp .env.production.example .env.production"
    exit 1
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down || true

# Build and start
echo "🔨 Building and starting containers..."
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Show status
echo ""
echo "📊 Container Status:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your application is running at:"
echo "  Frontend: http://YOUR_SERVER_IP:3000"
echo "  Backend:  http://YOUR_SERVER_IP:3001"
echo ""
echo "📝 Next steps:"
echo "  1. Get your server IP: curl ifconfig.me"
echo "  2. Update Sepay webhook: http://YOUR_SERVER_IP:3001/payment/sepay/webhook"
echo "  3. View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo ""
