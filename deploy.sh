#!/bin/bash

# Railway Track Crack Detection - Deployment Script
# This script builds and starts the entire application stack

set -e

echo "🚀 Starting deployment of Railway Track Crack Detection System..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Use 'docker compose' (v2) if available, otherwise use 'docker-compose' (v1)
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

echo "📦 Building Docker images..."
$COMPOSE_CMD build

echo ""
echo "🔄 Starting services..."
$COMPOSE_CMD up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
if $COMPOSE_CMD ps | grep -q "Up"; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "📍 Services are running:"
    echo "   - Frontend: http://localhost:3000"
    echo "   - Backend API: http://localhost:8080"
    echo "   - Health Check: http://localhost:8080/health"
    echo ""
    echo "📊 To view logs, run: $COMPOSE_CMD logs -f"
    echo "🛑 To stop services, run: $COMPOSE_CMD down"
else
    echo "❌ Deployment failed. Check logs with: $COMPOSE_CMD logs"
    exit 1
fi

