#!/bin/bash

# Pizza Pohoda - Start Script
# This script helps start the application with Docker

set -e

echo "🍕 Starting Pizza Pohoda..."

# Check if .env file exists
if [ ! -f "api/.env" ]; then
    echo "❌ Error: api/.env file not found!"
    echo "Please create it from api/.env.example and configure your settings."
    echo ""
    echo "Run: cp api/.env.example api/.env"
    echo "Then edit api/.env with your configuration."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed!"
    echo "Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! docker compose version &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed!"
    echo "Please install Docker Compose first: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Prerequisites checked"
echo ""

# Stop existing containers if running
echo "🛑 Stopping existing containers..."
docker compose down 2>/dev/null || true

echo ""
echo "🏗️  Building Docker images..."
docker compose build

echo ""
echo "🚀 Starting services..."
docker compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if containers are running
if docker compose ps | grep -q "Up\|running"; then
    echo ""
    echo "✅ Application started successfully!"
    echo ""
    echo "📍 Access points:"
    echo "   - Frontend: http://localhost"
    echo "   - API: http://localhost:3001"
    echo "   - RabbitMQ Management: http://localhost:15672"
    echo "   - Health check: http://localhost/api/health"
    echo ""
    echo "📊 View logs:"
    echo "   docker compose logs -f"
    echo ""
    echo "🛑 Stop application:"
    echo "   ./stop.sh"
else
    echo ""
    echo "❌ Error: Containers failed to start!"
    echo "Check logs with: docker compose logs"
    exit 1
fi
