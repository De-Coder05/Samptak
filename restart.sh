#!/bin/bash

# Restart script for Railway Track Crack Detection System

set -e

echo "🔄 Restarting Railway Track Crack Detection System..."

# Use 'docker compose' (v2) if available, otherwise use 'docker-compose' (v1)
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

$COMPOSE_CMD restart

echo "✅ Services restarted successfully!"

