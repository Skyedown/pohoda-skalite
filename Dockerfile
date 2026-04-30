# Multi-stage build for React frontend
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Deployment stage — copies built files into the shared volume and exits.
# This is a one-shot container: runs, copies dist/ to /vol, then exits.
# The always-running gateway container reads from the same named volume.
FROM alpine:3
COPY --from=builder /app/dist /dist
CMD ["sh", "-c", "cp -r /dist/. /vol/ && echo 'Frontend files deployed to volume'"]
