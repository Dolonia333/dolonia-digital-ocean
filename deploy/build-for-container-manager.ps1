# Dolonia Cloud - Container Manager Deployment Script (PowerShell)
# This script builds and exports your React app as a Docker image for NAS deployment

param(
    [switch]$SkipBuild,
    [switch]$Verbose
)

Write-Host "🚀 Building Dolonia Cloud for Container Manager deployment..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
try {
    $dockerVersion = docker --version 2>$null
    if ($Verbose) { Write-Host "Docker version: $dockerVersion" -ForegroundColor Gray }
} catch {
    Write-Host "[ERROR] Docker is not installed. Please install Docker first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if we're in the project root
if (!(Test-Path "package.json")) {
    Write-Host "[ERROR] Please run this script from the Dolonia Cloud project root directory." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

if (!(Test-Path "vite.config.ts")) {
    Write-Host "[ERROR] Please run this script from the Dolonia Cloud project root directory." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

if (!$SkipBuild) {
    Write-Host "[INFO] Installing dependencies..." -ForegroundColor Yellow
    try {
        npm ci
    } catch {
        Write-Host "[ERROR] Failed to install dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }

    Write-Host "[INFO] Building production bundle..." -ForegroundColor Yellow
    try {
        npm run build
    } catch {
        Write-Host "[ERROR] Failed to build production bundle" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "[INFO] Skipping npm build (using existing dist/)" -ForegroundColor Yellow
}

Write-Host "[INFO] Building Docker image..." -ForegroundColor Yellow
try {
    docker build -f deploy/Dockerfile -t dolonia-cloud:latest .
} catch {
    Write-Host "[ERROR] Failed to build Docker image" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[INFO] Exporting Docker image for Container Manager..." -ForegroundColor Yellow
try {
    docker save dolonia-cloud:latest -o deploy/dolonia-cloud.tar
} catch {
    Write-Host "[ERROR] Failed to export Docker image" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "" -ForegroundColor Green
Write-Host "✅ Dolonia Cloud Docker image exported successfully!" -ForegroundColor Green
Write-Host "📦 File location: deploy/dolonia-cloud.tar" -ForegroundColor White

# Get file size
$fileSize = (Get-Item "deploy/dolonia-cloud.tar").Length
Write-Host "📏 File size: $fileSize bytes" -ForegroundColor White

Write-Host "" -ForegroundColor Cyan
Write-Host "📋 Next steps for Container Manager:" -ForegroundColor Cyan
Write-Host "  1. Open your NAS Container Manager" -ForegroundColor White
Write-Host "  2. Go to Image → Import" -ForegroundColor White
Write-Host "  3. Upload deploy/dolonia-cloud.tar" -ForegroundColor White
Write-Host "  4. Create a new Container from the dolonia-cloud image" -ForegroundColor White
Write-Host "  5. Map container port 80 to NAS port (e.g., 8080)" -ForegroundColor White
Write-Host "  6. Access at: http://<your-nas-ip>:8080" -ForegroundColor White
Write-Host "" -ForegroundColor Cyan
Write-Host "💡 Pro tip: The container includes health checks for monitoring" -ForegroundColor Magenta
Write-Host "🔒 Security headers and gzip compression are enabled" -ForegroundColor Magenta
Write-Host "🎨 Favicon caching is optimized for your Dolonia logo" -ForegroundColor Magenta
Write-Host "" -ForegroundColor Green
Write-Host "🎉 Ready for Container Manager deployment!" -ForegroundColor Green
Write-Host "" -ForegroundColor Yellow

if ($Verbose) {
    Write-Host "Verbose mode: Checking Docker image details..." -ForegroundColor Gray
    docker images dolonia-cloud:latest
    Write-Host "" -ForegroundColor Gray
}

Read-Host "Press Enter to exit"