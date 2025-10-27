# Dolonia Digital Ocean - Complete NAS Deployment Package Creator
Write-Host "Creating complete NAS deployment package..." -ForegroundColor Green

# Clean up any existing packages
Remove-Item "dolonia-nas-deploy.zip" -Force -ErrorAction SilentlyContinue
Remove-Item "dolonia-deploy-temp" -Recurse -Force -ErrorAction SilentlyContinue

# Create temporary directory
New-Item -ItemType Directory -Path "dolonia-deploy-temp" | Out-Null

Write-Host "Copying essential files..." -ForegroundColor Yellow

# Copy core application files
Copy-Item "src" -Destination "dolonia-deploy-temp/src" -Recurse
Copy-Item "public" -Destination "dolonia-deploy-temp/public" -Recurse

# Copy configuration files
Copy-Item "package.json" -Destination "dolonia-deploy-temp/"
Copy-Item "package-lock.json" -Destination "dolonia-deploy-temp/"
Copy-Item "vite.config.ts" -Destination "dolonia-deploy-temp/"
Copy-Item "tsconfig.json" -Destination "dolonia-deploy-temp/"
Copy-Item "tsconfig.app.json" -Destination "dolonia-deploy-temp/"
Copy-Item "tsconfig.node.json" -Destination "dolonia-deploy-temp/"
Copy-Item "tailwind.config.ts" -Destination "dolonia-deploy-temp/"
Copy-Item "postcss.config.js" -Destination "dolonia-deploy-temp/"
Copy-Item "components.json" -Destination "dolonia-deploy-temp/"
Copy-Item "index.html" -Destination "dolonia-deploy-temp/"

# Copy Docker files
Copy-Item "Dockerfile" -Destination "dolonia-deploy-temp/"
Copy-Item "Dockerfile.vite" -Destination "dolonia-deploy-temp/"
Copy-Item "nginx.conf" -Destination "dolonia-deploy-temp/"
Copy-Item ".dockerignore" -Destination "dolonia-deploy-temp/"
Copy-Item "docker-compose.yml" -Destination "dolonia-deploy-temp/"

# Copy deployment scripts
Copy-Item "deploy.sh" -Destination "dolonia-deploy-temp/"
Copy-Item "deploy.ps1" -Destination "dolonia-deploy-temp/"

# Copy documentation
Copy-Item "DEPLOYMENT_INSTRUCTIONS_FIXED.txt" -Destination "dolonia-deploy-temp/README.txt"

# Create environment template
@"
# Dolonia Digital Ocean Environment Variables
# Copy this file to .env and configure your values

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_API_URL=https://your-api-url.com
"@ | Out-File "dolonia-deploy-temp/.env.example"

# Create quick start script for NAS
@"
#!/bin/bash
# Quick deployment script for NAS

echo "🚀 Dolonia Digital Ocean - NAS Deployment"
echo ""

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Creating .env from template..."
    cp .env.example .env
    echo "📝 Please edit .env file with your configuration before continuing."
    echo "   Then run this script again."
    exit 1
fi

echo "📦 Building Docker image..."
docker build -t dolonia-web:latest .

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "🛑 Stopping existing container..."
docker stop dolonia-web 2>/dev/null
docker rm dolonia-web 2>/dev/null

echo "🚀 Starting new container..."
docker run -d \
  --name dolonia-web \
  -p 80:80 \
  --restart unless-stopped \
  dolonia-web:latest

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your site is available at: http://$(hostname -I | awk '{print $1}')"
    echo ""
    echo "📊 Container status:"
    docker ps | grep dolonia-web
else
    echo "❌ Deployment failed!"
fi
"@ | Out-File "dolonia-deploy-temp/quick-deploy.sh" -Encoding UTF8

# Create Windows batch file for deployment
@"
@echo off
echo 🚀 Dolonia Digital Ocean - NAS Deployment
echo.

REM Check if .env exists
if not exist ".env" (
    echo ⚠️  Creating .env from template...
    copy ".env.example" ".env"
    echo 📝 Please edit .env file with your configuration before continuing.
    echo    Then run this script again.
    pause
    exit /b 1
)

echo 📦 Building Docker image...
docker build -t dolonia-web:latest .

if errorlevel 1 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo 🛑 Stopping existing container...
docker stop dolonia-web 2>nul
docker rm dolonia-web 2>nul

echo 🚀 Starting new container...
docker run -d --name dolonia-web -p 80:80 --restart unless-stopped dolonia-web:latest

if errorlevel 0 (
    echo ✅ Deployment successful!
    echo 🌐 Your site is available at: http://localhost
    echo.
    echo 📊 Container status:
    docker ps | findstr dolonia-web
) else (
    echo ❌ Deployment failed!
)

pause
"@ | Out-File "dolonia-deploy-temp/quick-deploy.bat"

Write-Host "Creating ZIP package..." -ForegroundColor Yellow

# Create the ZIP file using PowerShell compression
Compress-Archive -Path "dolonia-deploy-temp/*" -DestinationPath "dolonia-nas-deploy.zip" -Force

# Clean up temp directory
Remove-Item "dolonia-deploy-temp" -Recurse -Force

# Show results
$zipSize = (Get-Item "dolonia-nas-deploy.zip").Length / 1MB
Write-Host ""
Write-Host "✅ NAS deployment package created!" -ForegroundColor Green
Write-Host "📦 File: dolonia-nas-deploy.zip" -ForegroundColor Cyan
Write-Host "📏 Size: $([math]::Round($zipSize, 2)) MB" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 NEXT STEPS:" -ForegroundColor Green
Write-Host "1. Upload 'dolonia-nas-deploy.zip' to your NAS" -ForegroundColor Yellow
Write-Host "2. Extract it in File Station to a new folder" -ForegroundColor Yellow
Write-Host "3. SSH into your NAS and navigate to the folder" -ForegroundColor Yellow
Write-Host "4. Run: chmod +x quick-deploy.sh && ./quick-deploy.sh" -ForegroundColor Yellow
Write-Host "5. Access your site at http://your-nas-ip" -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 Files included:" -ForegroundColor Cyan
Write-Host "- Complete React + TypeScript source code" -ForegroundColor White
Write-Host "- Fixed Dockerfile (with TypeScript support)" -ForegroundColor White
Write-Host "- Alternative Dockerfile.vite" -ForegroundColor White
Write-Host "- Nginx configuration" -ForegroundColor White
Write-Host "- Docker Compose setup" -ForegroundColor White
Write-Host "- Quick deployment scripts" -ForegroundColor White
Write-Host "- Environment template (.env.example)" -ForegroundColor White
Write-Host "- Complete documentation (README.txt)" -ForegroundColor White