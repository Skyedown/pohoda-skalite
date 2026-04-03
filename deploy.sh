#!/bin/bash
set -e

# 1. Configuration
APP_DIR="/root/pohoda-skalite"
API_CONTAINER="pizza-pohoda-api"
FRONTEND_CONTAINER="pizza-pohoda-frontend"
RABBITMQ_CONTAINER="pizza-pohoda-rabbitmq"
SERVICES=("api:pohoda-api" "frontend:pohoda-frontend")

cd $APP_DIR

echo "🚀 Starting Deployment for Pizza Pohoda..."

# 2. Snapshot current images for rollback
echo "📸 Snapshotting current images..."
for pair in "${SERVICES[@]}"; do
    IMG="${pair##*:}"
    if [[ "$(docker images -q $IMG:latest 2> /dev/null)" != "" ]]; then
        docker tag $IMG:latest $IMG:rollback
        echo "   - Created rollback point for $IMG"
    fi
done

# 3. Update Code
echo "📥 Pulling latest code from GitHub..."
git fetch origin main
git reset --hard origin/main

# 4. Build and Start
echo "🏗️ Rebuilding containers..."
# Use 'docker compose' (with space). If your server requires hyphen, change to 'docker-compose'
# Stop only app containers, keep RabbitMQ running to avoid losing queued messages
docker compose stop api frontend
docker compose rm -f api frontend
docker compose up -d --build

# 5. Health Check Phase
echo "🏥 Checking Health..."
MAX_RETRIES=20
SLEEP=5
ALL_HEALTHY=false

for ((i=1; i<=MAX_RETRIES; i++)); do
    # Safe inspect: checks if Health object exists to avoid "map has no entry" error
    API_HEALTH=$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}starting{{end}}' $API_CONTAINER)
    FRONT_STATUS=$(docker inspect --format='{{.State.Status}}' $FRONTEND_CONTAINER)
    RABBIT_HEALTH=$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}starting{{end}}' $RABBITMQ_CONTAINER)

    echo "   - Attempt $i: API [$API_HEALTH], Frontend [$FRONT_STATUS], RabbitMQ [$RABBIT_HEALTH]"

    if [ "$API_HEALTH" == "healthy" ] && [ "$FRONT_STATUS" == "running" ] && [ "$RABBIT_HEALTH" == "healthy" ]; then
        echo "✅ SUCCESS: All services are healthy!"
        ALL_HEALTHY=true
        break
    fi
    
    if [ "$API_HEALTH" == "unhealthy" ] || [ "$RABBIT_HEALTH" == "unhealthy" ]; then
        echo "❌ FAILURE: A service reported UNHEALTHY status."
        break
    fi
    
    if [ $i -eq $MAX_RETRIES ]; then
        echo "⏰ TIMEOUT: Services did not become healthy in time."
        ALL_HEALTHY=false
    fi
    
    sleep $SLEEP
done

# 6. Final Decision: Cleanup or Rollback
if [ "$ALL_HEALTHY" = true ]; then
    echo "✨ Deployment Successful! Cleaning up..."
    # Keep only the last 5 images logic (Prunes unused/dangling images)
    docker image prune -f
    # Delete images older than 48h to keep storage clean
    docker image prune -a --force --filter "until=48h"
    exit 0
else
    echo "⚠️ CRITICAL: Deployment failed. Rolling back to previous version..."
    
    docker compose down
    
    # Revert 'rollback' tags to 'latest'
    for pair in "${SERVICES[@]}"; do
        IMG="${pair##*:}"
        if [[ "$(docker images -q $IMG:rollback 2> /dev/null)" != "" ]]; then
            docker tag $IMG:rollback $IMG:latest
            echo "   - Restored $IMG from rollback tag"
        fi
    done
    
    # Restart the old version
    docker compose up -d
    echo "🔄 Rollback complete. Stable version is running."
    
    # Check logs of the FAILED container to help you debug in GitHub Actions
    echo "📝 Logs from failed API attempt:"
    docker logs $API_CONTAINER --tail 50
    
    exit 1 # Exit with error to notify GitHub Actions
fi
