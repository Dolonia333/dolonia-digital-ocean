# Multi-stage Docker build for Dolonia Cloud
# Optimized for Container Manager deployment on NAS
# Includes favicon caching fixes and security hardening

# --- Build Stage ---
FROM node:18-alpine AS build

# Install build dependencies
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Copy package files for better caching
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# --- Production Stage ---
FROM nginx:alpine

# Install security updates and curl for health checks
RUN apk add --no-cache curl && \
    apk upgrade --no-cache

# Create nginx user and directories
RUN mkdir -p /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx

# Copy built app from build stage
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY --chown=nginx:nginx deploy/nginx.conf /etc/nginx/conf.d/default.conf

# Copy health check file
COPY --chown=nginx:nginx public/health.html /usr/share/nginx/html/health.html

# Switch to non-root user for security
USER nginx

# Expose port 80
EXPOSE 80

# Health check for Container Manager monitoring
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]