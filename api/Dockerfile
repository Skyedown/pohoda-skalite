# Node.js API Dockerfile
FROM node:20-alpine

# Install wget for healthcheck
RUN apk add --no-cache wget

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including devDependencies for TypeScript build)
RUN npm ci

# Copy application source files
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Remove dev dependencies after build to reduce image size
RUN npm prune --production

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Create data directory and set permissions
RUN mkdir -p /app/dist/data && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port 3001
EXPOSE 3001

# Start the compiled application
CMD ["node", "dist/server.js"]

# This tells Docker HOW to test if the container is working
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=5 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1
