@echo off
REM Dolonia Cloud - Container Manager Deployment Script (Windows)
REM This script builds and exports your React app as a Docker image for NAS deployment

echo 🚀 Building Dolonia Cloud for Container Manager deployment...
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed. Please install Docker first.
    pause
    exit /b 1
)

REM Check if we're in the project root
if not exist "package.json" (
    echo [ERROR] Please run this script from the Dolonia Cloud project root directory.
    pause
    exit /b 1
)

if not exist "vite.config.ts" (
    echo [ERROR] Please run this script from the Dolonia Cloud project root directory.
    pause
    exit /b 1
)

echo [INFO] Installing dependencies...
call npm ci
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo [INFO] Building production bundle...
call npm run build
if errorlevel 1 (
    echo [ERROR] Failed to build production bundle
    pause
    exit /b 1
)

echo [INFO] Building Docker image...
docker build -f deploy/Dockerfile -t dolonia-cloud:latest .
if errorlevel 1 (
    echo [ERROR] Failed to build Docker image
    pause
    exit /b 1
)

echo [INFO] Exporting Docker image for Container Manager...
docker save dolonia-cloud:latest -o deploy/dolonia-cloud.tar
if errorlevel 1 (
    echo [ERROR] Failed to export Docker image
    pause
    exit /b 1
)

echo.
echo ✅ Dolonia Cloud Docker image exported successfully!
echo 📦 File location: deploy/dolonia-cloud.tar
for %%A in (deploy/dolonia-cloud.tar) do echo 📏 File size: %%~zA bytes
echo.
echo 📋 Next steps for Container Manager:
echo   1. Open your NAS Container Manager
echo   2. Go to Image → Import
echo   3. Upload deploy/dolonia-cloud.tar
echo   4. Create a new Container from the dolonia-cloud image
echo   5. Map container port 80 to NAS port (e.g., 8080)
echo   6. Access at: http://^<your-nas-ip^>:8080
echo.
echo 💡 Pro tip: The container includes health checks for monitoring
echo 🔒 Security headers and gzip compression are enabled
echo 🎨 Favicon caching is optimized for your Dolonia logo
echo.
echo 🎉 Ready for Container Manager deployment!
echo.
pause