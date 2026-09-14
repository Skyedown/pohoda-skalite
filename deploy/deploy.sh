#!/usr/bin/env bash
#
# Runs on the droplet, over SSH, from .github/workflows/ci.yml. Deploys ONE
# specific image tag — the git commit sha CI just built — rather than the
# mutable `latest`, so two pushes landing close together can never race each
# other onto the wrong image, and `git reset --hard "$NEW_TAG"` puts
# docker-compose.yml itself in lockstep with the images it is running.
#
# On failure — compose refusing to start, or the app starting but never
# answering its health check — this rolls back to the last tag that passed its
# own health check, so a bad deploy never leaves the site down.
#
# Usage: deploy.sh <git-sha>

set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_IMAGE="ghcr.io/skyedown/pohoda-skalite-frontend"
API_IMAGE="ghcr.io/skyedown/pohoda-skalite-api"
# One deployed (and health-checked) tag per line, oldest first. The source of
# truth for both rollback and pruning — not a record of every pull attempt,
# only of what actually ran successfully.
HISTORY_FILE="$APP_DIR/.deploy_history"
KEEP=5
# Through nginx to the API and on to MongoDB, so a pass means "this deploy can
# actually take an order". The frontend container answering on / would only
# prove nginx started; an API crash-looping on a bad env var sails past that.
HEALTH_PATH="/api/health"
HEALTH_RETRIES=15
HEALTH_DELAY_S=4

NEW_TAG="${1:?usage: deploy.sh <git-sha>}"

cd "$APP_DIR"

git fetch origin main
git reset --hard "$NEW_TAG"

PREV_TAG=""
if [ -s "$HISTORY_FILE" ]; then
    PREV_TAG="$(tail -n1 "$HISTORY_FILE")"
fi

echo "==> Pulling ${NEW_TAG}"
if ! TAG="$NEW_TAG" docker compose pull api frontend; then
    echo "==> Pull failed. Is the droplet logged in to ghcr.io?"
    echo "    docker login ghcr.io -u skyedown -p <PAT with read:packages>"
    exit 1
fi

# TAG is read by docker-compose.yml's `image: …:${TAG:-latest}` — exporting it
# per invocation, rather than writing it into a tracked file, keeps the
# deployed version a property of this run and never something left stale.
bring_up() {
    # RabbitMQ holds the queue of tickets the printer has not taken yet, and
    # nothing about it changes between releases — start it if it is down, but
    # never recreate it. Only the two app containers get replaced.
    TAG="$1" docker compose up -d rabbitmq || return 1
    TAG="$1" docker compose up -d --no-deps --force-recreate api frontend
}

health_url() {
    local mapping port
    mapping="$(docker compose port frontend 80 2>/dev/null | tail -n1)"
    port="${mapping##*:}"
    if [ -z "$port" ]; then
        echo "==> Could not read the published port; falling back to ${WEB_PORT:-8080}." >&2
        port="${WEB_PORT:-8080}"
    fi
    echo "http://127.0.0.1:${port}${HEALTH_PATH}"
}

wait_for_health() {
    local url
    url="$(health_url)"
    echo "==> Waiting on ${url}"
    for _ in $(seq 1 "$HEALTH_RETRIES"); do
        if curl -fsS "$url" >/dev/null 2>&1; then
            return 0
        fi
        sleep "$HEALTH_DELAY_S"
    done
    return 1
}

rollback_or_die() {
    local reason="$1"
    echo "==> ${reason}"
    docker compose logs api --tail 50 || true

    if [ -z "$PREV_TAG" ] || [ "$PREV_TAG" = "$NEW_TAG" ]; then
        echo "==> No earlier known-good tag to roll back to. Site is left as-is — check manually."
        exit 1
    fi

    echo "==> Rolling back to ${PREV_TAG}"
    # The compose file goes back with the images. Rolling back the image alone
    # would leave the working tree on the failed commit, handing the old image
    # a config it was never built against.
    if ! git reset --hard "$PREV_TAG"; then
        echo "==> Could not check out ${PREV_TAG}; rolling back images against the current config."
    fi

    if bring_up "$PREV_TAG" && wait_for_health; then
        echo "==> Rollback to ${PREV_TAG} confirmed healthy."
    else
        echo "==> Rollback ALSO failed health checks. Manual intervention needed."
    fi
    exit 1
}

echo "==> Starting ${NEW_TAG}"
# `up -d` succeeding only means the containers started, not that the app inside
# is healthy — a container crash-looping on a bad env var still "starts" as far
# as compose is concerned.
if ! bring_up "$NEW_TAG"; then
    rollback_or_die "compose up failed for ${NEW_TAG}"
fi

if ! wait_for_health; then
    rollback_or_die "Health check failed for ${NEW_TAG} after ${HEALTH_RETRIES} attempts"
fi

echo "==> ${NEW_TAG} is healthy."
echo "$NEW_TAG" >>"$HISTORY_FILE"

# Keep only the KEEP most recently deployed tags, both in the history file and
# on disk. The registry keeps every image regardless — this is disk hygiene on
# the droplet, not a retention policy.
mapfile -t history <"$HISTORY_FILE"
if [ "${#history[@]}" -gt "$KEEP" ]; then
    keep_tags=("${history[@]: -$KEEP}")
else
    keep_tags=("${history[@]}")
fi
printf '%s\n' "${keep_tags[@]}" >"$HISTORY_FILE"

is_kept() {
    local tag="$1"
    for kept in "${keep_tags[@]}"; do
        [ "$kept" = "$tag" ] && return 0
    done
    return 1
}

for image in "$FRONTEND_IMAGE" "$API_IMAGE"; do
    while IFS= read -r old_tag; do
        [ -z "$old_tag" ] && continue
        [ "$old_tag" = "latest" ] && continue
        if ! is_kept "$old_tag"; then
            echo "==> Removing old image ${image}:${old_tag}"
            docker rmi "${image}:${old_tag}" 2>/dev/null || true
        fi
    done < <(docker images "$image" --format '{{.Tag}}' | sort -u)
done

docker image prune -f
