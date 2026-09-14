# Multi-stage build for React frontend
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Vite inlines VITE_* at build time, so the values must exist before the build
# runs. On CI they arrive as build args from GitHub secrets and variables.
ARG VITE_API_URL=""
ARG VITE_RESTAURANT_EMAIL
ARG VITE_RESTAURANT_PHONE
ARG VITE_PREORDER_START_TIME
ARG VITE_OPENING_TIME
ARG VITE_LAST_ORDER_TIME
ARG VITE_CLOSING_TIME
ARG VITE_ADMIN_NAME
ARG VITE_ADMIN_PASSWORD
ARG VITE_COMPANY_ICO
ARG VITE_COMPANY_DIC
ARG VITE_COMPANY_IC_DPH
ARG VITE_GA_ID_SK
ARG VITE_GA_ID_PL
ARG VITE_META_PIXEL_ID

RUN npm run build

# Production stage with nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Serves both pizzapohoda.sk and pizzapohoda.pl, split by Host header
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
