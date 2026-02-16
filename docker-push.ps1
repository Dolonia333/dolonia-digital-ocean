# Docker Hub Push Script for DOLONIA DATA TECH (PowerShell)
# Builds and pushes the Docker image to Docker Hub

# Configuration
$DOCKER_USERNAME = "doloniadatatech"
$IMAGE_NAME = "dolonia-cloud"
$VERSION = "1.0.0"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  DOLONIA DATA TECH - Docker Hub Push" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
try {
    docker info | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Docker is not running" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again" -ForegroundColor Yellow
    exit 1
}

# Check if logged in to Docker Hub
$dockerInfo = docker info 2>&1 | Out-String
if ($dockerInfo -notmatch "Username: $DOCKER_USERNAME") {
    Write-Host "⚠️  Not logged in to Docker Hub" -ForegroundColor Yellow
    Write-Host "Please run: docker login" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Logged in as: $DOCKER_USERNAME" -ForegroundColor Green
Write-Host ""

# Navigate to deployment folder
Write-Host "📁 Navigating to DEPLOY-TO-NAS folder..." -ForegroundColor Cyan
Set-Location -Path "DEPLOY-TO-NAS"

# Build the Docker image
Write-Host ""
Write-Host "🔨 Building Docker image..." -ForegroundColor Cyan
Write-Host "   Image: $DOCKER_USERNAME/$IMAGE_NAME" -ForegroundColor Gray
Write-Host "   Tags: latest, $VERSION" -ForegroundColor Gray
Write-Host ""

docker build `
    -t "${DOCKER_USERNAME}/${IMAGE_NAME}:latest" `
    -t "${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}" `
    .

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Push to Docker Hub
Write-Host ""
Write-Host "📤 Pushing to Docker Hub..." -ForegroundColor Cyan
Write-Host ""

Write-Host "Pushing latest tag..." -ForegroundColor Gray
docker push "${DOCKER_USERNAME}/${IMAGE_NAME}:latest"

Write-Host ""
Write-Host "Pushing version tag ($VERSION)..." -ForegroundColor Gray
docker push "${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "  ✅ Successfully pushed to Docker Hub!" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 View on Docker Hub:" -ForegroundColor Cyan
    Write-Host "   https://hub.docker.com/r/$DOCKER_USERNAME/$IMAGE_NAME" -ForegroundColor White
    Write-Host ""
    Write-Host "📦 Pull command:" -ForegroundColor Cyan
    Write-Host "   docker pull ${DOCKER_USERNAME}/${IMAGE_NAME}:latest" -ForegroundColor White
    Write-Host ""
    Write-Host "🚀 Run command:" -ForegroundColor Cyan
    Write-Host "   docker run -d -p 8080:80 ``" -ForegroundColor White
    Write-Host "     -e VITE_SUPABASE_URL=https://supabase.dolonia.cloud ``" -ForegroundColor White
    Write-Host "     -e VITE_SUPABASE_ANON_KEY=your_key_here ``" -ForegroundColor White
    Write-Host "     ${DOCKER_USERNAME}/${IMAGE_NAME}:latest" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Push failed!" -ForegroundColor Red
    exit 1
}
