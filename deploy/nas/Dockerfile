# Use Node.js 20 Alpine as base image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install dependencies (including devDependencies for TypeScript)
# Remove package-lock to avoid platform-specific optional dep issues on Alpine
RUN rm -f package-lock.json && npm install --legacy-peer-deps

# Copy frontend source and config
COPY frontend/ ./frontend/
COPY config/env/.env.production ./config/env/.env.production

# Build the application from frontend directory
RUN cd frontend && npx vite build --config vite.config.ts

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Copy nginx configuration
COPY deploy/nas/nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
