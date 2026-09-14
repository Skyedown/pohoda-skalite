#!/bin/bash
set -e

# Images are built and pushed by GitHub Actions. This script only pulls the tag
# that CI just published, swaps the containers and rolls back if they fail.
#
# Usage: ./deploy.sh [git-sha]   — no argument falls back to :latest

APP_DIR="/root/pohoda-skalite"
API_CONTAINER="pizza-pohoda-api"
FRONTEND_CONTAINER="pizza-pohoda-frontend"
RABBITMQ_CONTAINER="pizza-pohoda-rabbitmq"

REGISTRY="ghcr.io"
FRONTEND_REPO="ghcr.io/skyedown/pohoda-skalite-frontend"
API_REPO="ghcr.io/skyedown/pohoda-skalite-api"

TAG="${1:-latest}"

export FRONTEND_IMAGE="${FRONTEND_REPO}:${TAG}"
export API_IMAGE="${API_REPO}:${TAG}"

cd $APP_DIR

echo "🚀 Starting Deployment for Pizza Pohoda..."
echo "   Frontend: $FRONTEND_IMAGE"
echo "   API:      $API_IMAGE"

# 1. Remember what is running now so a failed deploy can be undone
echo "📸 Recording current image digests for rollback..."
ROLLBACK_FRONTEND=$(docker inspect --format='{{.Image}}' $FRONTEND_CONTAINER 2>/dev/null || echo "")
ROLLBACK_API=$(docker inspect --format='{{.Image}}' $API_CONTAINER 2>/dev/null || echo "")
[ -n "$ROLLBACK_FRONTEND" ] && echo "   - Frontend rollback point: ${ROLLBACK_FRONTEND:0:19}"
[ -n "$ROLLBACK_API" ] && echo "   - API rollback point: ${ROLLBACK_API:0:19}"

# 2. Update compose file and .env (the images themselves come from the registry)
echo "📥 Pulling latest code from GitHub..."
git fetch origin main
git reset --hard origin/main

# 3. Pull the images CI just published
echo "📦 Pulling images from $REGISTRY..."
if ! docker compose pull api frontend; then
    echo "❌ FAILURE: could not pull images. Is the droplet logged in to $REGISTRY?"
    echo "   Run: docker login $REGISTRY -u <github-user> -p <PAT with read:packages>"
    exit 1
fi

# 4. Recreate containers from the pulled images
echo "🔄 Recreating containers..."
docker compose up -d --no-deps --force-recreate api frontend

# 5. Health Check Phase
echo "🏥 Checking Health..."
MAX_RETRIES=20
SLEEP=5
ALL_HEALTHY=false

for ((i=1; i<=MAX_RETRIES; i++)); do
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
    fi

    sleep $SLEEP
done

# 6. Final Decision: Cleanup or Rollback
if [ "$ALL_HEALTHY" = true ]; then
    echo "✨ Deployment Successful! Cleaning up..."
    docker image prune -f
    docker image prune -a --force --filter "until=48h"
    exit 0
fi

echo "⚠️ CRITICAL: Deployment failed. Rolling back to previous images..."

if [ -z "$ROLLBACK_FRONTEND" ] || [ -z "$ROLLBACK_API" ]; then
    echo "❌ No previous images recorded — cannot roll back automatically."
    docker logs $API_CONTAINER --tail 50
    exit 1
fi

export FRONTEND_IMAGE="$ROLLBACK_FRONTEND"
export API_IMAGE="$ROLLBACK_API"
docker compose up -d --no-deps --force-recreate api frontend

echo "🔄 Rollback complete. Previous version is running."
echo "📝 Logs from failed API attempt:"
docker logs $API_CONTAINER --tail 50

exit 1
