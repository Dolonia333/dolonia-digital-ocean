#!/bin/bash
# Simple deployment script to run on NAS
# Save this as deploy_on_nas.sh and run it after uploading files

echo "Starting Dolonia Cloud deployment on NAS..."

# Navigate to project directory
cd /volume1/docker/dolonia-cloud

echo "Building and starting Docker containers..."
docker-compose down || true
docker-compose up -d --build

echo "Waiting for services to start..."
sleep 10

echo "Checking container status..."
docker-compose ps

echo "Testing health endpoint..."
if curl -f http://localhost:8080/health >/dev/null 2>&1; then
    echo "✅ Health check passed!"
else
    echo "⚠️  Health check failed - check logs with: docker-compose logs"
fi

echo ""
echo "🎉 Deployment completed!"
echo "Access your application at: http://10.15.20.201:8080"
echo "Health check: http://10.15.20.201:8080/health"