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

# 4. Build new images without touching running containers
echo "🏗️ Building new images..."
docker compose build api frontend

# 5. Recreate containers from new images
echo "🔄 Recreating containers..."
docker compose up -d --no-deps --force-recreate api frontend

# 6. Health Check Phase
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

# 7. Final Decision: Cleanup or Rollback
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

# 4. Build new images without touching running containers
echo "🏗️ Building new images..."
docker compose build api frontend

# 5a. Deploy new frontend files into the shared volume.
# The frontend container copies dist/ to /vol (mounted as frontend-static), then exits.
# The gateway container is never restarted — it keeps serving traffic the whole time.
echo "📄 Deploying frontend files to shared volume..."
docker compose up --no-deps --force-recreate --exit-code-from frontend frontend

# 5b. Ensure the gateway is running (starts it on first deploy, no-op on subsequent ones).
GATEWAY_STATUS=$(docker inspect --format='{{.State.Status}}' $GATEWAY_CONTAINER 2>/dev/null || echo "not_found")
if [ "$GATEWAY_STATUS" != "running" ]; then
    echo "🌐 Starting gateway for the first time..."
    docker compose up -d --no-deps gateway
fi

# 5c. Recreate the API container only. Gateway stays up the entire time.
echo "🔄 Recreating API container..."
docker compose up -d --no-deps --force-recreate api

# 6. Health Check Phase
echo "🏥 Checking Health..."
MAX_RETRIES=20
SLEEP=5
ALL_HEALTHY=false

for ((i=1; i<=MAX_RETRIES; i++)); do
    API_HEALTH=$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}starting{{end}}' $API_CONTAINER)
    GATEWAY_STATUS=$(docker inspect --format='{{.State.Status}}' $GATEWAY_CONTAINER)
    RABBIT_HEALTH=$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}starting{{end}}' $RABBITMQ_CONTAINER)

    echo "   - Attempt $i: API [$API_HEALTH], Gateway [$GATEWAY_STATUS], RabbitMQ [$RABBIT_HEALTH]"

    if [ "$API_HEALTH" == "healthy" ] && [ "$GATEWAY_STATUS" == "running" ] && [ "$RABBIT_HEALTH" == "healthy" ]; then
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

# 7. Final Decision: Cleanup or Rollback
if [ "$ALL_HEALTHY" = true ]; then
    echo "✨ Deployment Successful! Cleaning up..."
    docker image prune -f
    docker image prune -a --force --filter "until=48h"
    exit 0
else
    echo "⚠️ CRITICAL: Deployment failed. Rolling back to previous version..."

    # Revert images to the rollback snapshot
    for pair in "${SERVICES[@]}"; do
        IMG="${pair##*:}"
        if [[ "$(docker images -q $IMG:rollback 2> /dev/null)" != "" ]]; then
            docker tag $IMG:rollback $IMG:latest
            echo "   - Restored $IMG from rollback tag"
        fi
    done

    # Restore old frontend files into the volume using the rollback image
    echo "📄 Restoring previous frontend files..."
    docker compose up --no-deps --force-recreate frontend

    # Restore old API container
    echo "🔄 Restoring previous API container..."
    docker compose up -d --no-deps --force-recreate api

    echo "🔄 Rollback complete. Stable version is running."

    echo "📝 Logs from failed API attempt:"
    docker logs $API_CONTAINER --tail 50

    exit 1
fi
