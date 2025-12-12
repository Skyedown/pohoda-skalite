#!/bin/bash

# Pizza Pohoda - Stop Script
# This script stops all running Docker containers

set -e

echo "🛑 Stopping Pizza Pohoda..."

# Stop and remove containers
docker-compose down

echo ""
echo "✅ Application stopped successfully!"
echo ""
echo "📝 Note: Your data and configurations are preserved."
echo ""
echo "🚀 To start again, run: ./start.sh"
