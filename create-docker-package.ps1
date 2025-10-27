# Create Docker deployment package
# This script creates a ZIP file with all necessary files for Docker deployment

Write-Host "Creating Docker deployment package..." -ForegroundColor Green

# Create temp directory for packaging
$tempDir = "dolonia-docker-package"
$zipName = "dolonia-docker-deployment.zip"

# Remove existing package if it exists
if (Test-Path $zipName) {
    Remove-Item $zipName -Force
    Write-Host "Removed existing package" -ForegroundColor Yellow
}

if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}

# Create package directory
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy essential files for Docker deployment
Write-Host "Copying files..." -ForegroundColor Yellow

# Core application files
Copy-Item "src" -Destination "$tempDir/src" -Recurse
Copy-Item "public" -Destination "$tempDir/public" -Recurse
Copy-Item "package.json" -Destination "$tempDir/"
Copy-Item "package-lock.json" -Destination "$tempDir/"
Copy-Item "vite.config.ts" -Destination "$tempDir/"
Copy-Item "tsconfig.json" -Destination "$tempDir/"
Copy-Item "tsconfig.app.json" -Destination "$tempDir/"
Copy-Item "tsconfig.node.json" -Destination "$tempDir/"
Copy-Item "tailwind.config.ts" -Destination "$tempDir/"
Copy-Item "postcss.config.js" -Destination "$tempDir/"
Copy-Item "components.json" -Destination "$tempDir/"
Copy-Item "index.html" -Destination "$tempDir/"

# Docker files
Copy-Item "Dockerfile" -Destination "$tempDir/"
Copy-Item "nginx.conf" -Destination "$tempDir/"
Copy-Item ".dockerignore" -Destination "$tempDir/"
Copy-Item "docker-compose.yml" -Destination "$tempDir/"
Copy-Item "deploy.sh" -Destination "$tempDir/"
Copy-Item "deploy.ps1" -Destination "$tempDir/"

# Environment file (create a template)
"# Dolonia Digital Ocean Environment Variables
# Copy this to .env and configure your values
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_API_URL=your_api_url_here" | Out-File "$tempDir/.env.template"

# Create README for deployment
@"
# Dolonia Digital Ocean - Docker Deployment

## Quick Start

1. **Unzip this package** on your NAS/server
2. **Copy .env.template to .env** and configure your environment variables
3. **Run deployment script:**

### On Linux/NAS:
```bash
chmod +x deploy.sh
./deploy.sh
```

### On Windows:
```powershell
./deploy.ps1
```

### Using Docker Compose:
```bash
docker-compose up -d
```

## Manual Deployment

1. Build the image:
```bash
docker build -t dolonia-web:latest .
```

2. Run the container:
```bash
docker run -d --name dolonia-web -p 80:80 --restart unless-stopped dolonia-web:latest
```

## Features Included

- ✅ Production-optimized React build
- ✅ Nginx web server with optimized configuration
- ✅ Gzip compression enabled
- ✅ Client-side routing support
- ✅ Static asset caching
- ✅ Security headers
- ✅ Auto-restart on failure

## Access Your Site

After deployment, your site will be available at:
- http://your-server-ip
- http://localhost (if running locally)

## Troubleshooting

Check container logs:
```bash
docker logs dolonia-web
```

Check container status:
```bash
docker ps
```

Stop container:
```bash
docker stop dolonia-web
```

Remove container:
```bash
docker rm dolonia-web
```
"@ | Out-File "$tempDir/README.md"

# Create the ZIP file
Write-Host "Creating ZIP package..." -ForegroundColor Yellow
Compress-Archive -Path "$tempDir/*" -DestinationPath $zipName -Force

# Cleanup temp directory
Remove-Item $tempDir -Recurse -Force

# Show results
$zipSize = (Get-Item $zipName).Length / 1MB
Write-Host "Package created successfully!" -ForegroundColor Green
Write-Host "File: $zipName" -ForegroundColor Cyan
Write-Host "Size: $([math]::Round($zipSize, 2)) MB" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ready for deployment on your NAS!" -ForegroundColor Green
Write-Host "Upload this ZIP file to your NAS and follow the README.md instructions." -ForegroundColor Yellow