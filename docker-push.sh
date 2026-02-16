#!/bin/bash

# Docker Hub Push Script for DOLONIA DATA TECH
# Builds and pushes the Docker image to Docker Hub

set -e  # Exit on error

# Configuration
DOCKER_USERNAME="doloniadatatech"
IMAGE_NAME="dolonia-cloud"
VERSION="1.0.0"

echo "=========================================="
echo "  DOLONIA DATA TECH - Docker Hub Push"
echo "=========================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running"
    echo "Please start Docker Desktop and try again"
    exit 1
fi

# Check if logged in to Docker Hub
if ! docker info | grep -q "Username: $DOCKER_USERNAME" 2>/dev/null; then
    echo "⚠️  Not logged in to Docker Hub"
    echo "Please run: docker login"
    exit 1
fi

echo "✅ Docker is running"
echo "✅ Logged in as: $DOCKER_USERNAME"
echo ""

# Navigate to deployment folder
echo "📁 Navigating to DEPLOY-TO-NAS folder..."
cd DEPLOY-TO-NAS

# Build the Docker image
echo ""
echo "🔨 Building Docker image..."
echo "   Image: $DOCKER_USERNAME/$IMAGE_NAME"
echo "   Tags: latest, $VERSION"
echo ""

docker build \
    -t $DOCKER_USERNAME/$IMAGE_NAME:latest \
    -t $DOCKER_USERNAME/$IMAGE_NAME:$VERSION \
    .

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build completed successfully!"
else
    echo ""
    echo "❌ Build failed!"
    exit 1
fi

# Push to Docker Hub
echo ""
echo "📤 Pushing to Docker Hub..."
echo ""

echo "Pushing latest tag..."
docker push $DOCKER_USERNAME/$IMAGE_NAME:latest

echo ""
echo "Pushing version tag ($VERSION)..."
docker push $DOCKER_USERNAME/$IMAGE_NAME:$VERSION

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "  ✅ Successfully pushed to Docker Hub!"
    echo "=========================================="
    echo ""
    echo "🌐 View on Docker Hub:"
    echo "   https://hub.docker.com/r/$DOCKER_USERNAME/$IMAGE_NAME"
    echo ""
    echo "📦 Pull command:"
    echo "   docker pull $DOCKER_USERNAME/$IMAGE_NAME:latest"
    echo ""
    echo "🚀 Run command:"
    echo "   docker run -d -p 8080:80 \\"
    echo "     -e VITE_SUPABASE_URL=https://supabase.dolonia.cloud \\"
    echo "     -e VITE_SUPABASE_ANON_KEY=your_key_here \\"
    echo "     $DOCKER_USERNAME/$IMAGE_NAME:latest"
    echo ""
else
    echo ""
    echo "❌ Push failed!"
    exit 1
fi
