#!/bin/bash

# PrimeAcc Deployment Script
# Usage: ./deploy.sh [environment]
# Example: ./deploy.sh production

set -e

ENV=${1:-production}
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.${ENV}"

echo "🚀 PrimeAcc Deployment Script"
echo "================================"
echo "Environment: $ENV"
echo "Compose file: $COMPOSE_FILE"
echo "Env file: $ENV_FILE"
echo ""

# Check if env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Error: $ENV_FILE not found!"
    echo "Please create it from .env.production.example"
    exit 1
fi

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed!"
    echo "Install Docker: curl -fsSL https://get.docker.com | sh"
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed!"
    echo "Install: sudo curl -L \"https://github.com/docker/compose/releases/latest/download/docker-compose-\$(uname -s)-\$(uname -m)\" -o /usr/local/bin/docker-compose"
    echo "Then: sudo chmod +x /usr/local/bin/docker-compose"
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main || echo "⚠️  Warning: Could not pull latest code (not a git repo or no remote)"
echo ""

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f $COMPOSE_FILE down || true
echo ""

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose -f $COMPOSE_FILE --env-file $ENV_FILE up -d --build

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check container status
echo ""
echo "📊 Container Status:"
docker-compose -f $COMPOSE_FILE ps

# Check logs for errors
echo ""
echo "📋 Recent logs:"
docker-compose -f $COMPOSE_FILE logs --tail=20

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🔍 Useful commands:"
echo "  View logs:    docker-compose -f $COMPOSE_FILE logs -f"
echo "  Check status: docker-compose -f $COMPOSE_FILE ps"
echo "  Restart:      docker-compose -f $COMPOSE_FILE restart"
echo "  Stop:         docker-compose -f $COMPOSE_FILE down"
echo ""
echo "🌐 Access your application:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3001"
echo ""
