# Multi-stage build for React frontend
#
# The image carries no configuration. docker/40-app-config.sh writes config.js
# from the container's environment on startup, so the same image runs against
# any .env — no rebuild for a changed phone number, GA id or admin password.

FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Serves both pizzapohoda.sk and pizzapohoda.pl, split by Host header
COPY nginx.conf /etc/nginx/conf.d/default.conf

# nginx's official entrypoint runs every *.sh in here before starting nginx
COPY docker/40-app-config.sh /docker-entrypoint.d/40-app-config.sh
RUN chmod +x /docker-entrypoint.d/40-app-config.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
