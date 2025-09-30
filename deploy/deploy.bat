@echo off
REM Dolonia Cloud - Windows SSH Deployment Script
REM Usage: deploy.bat [NAS_IP] [USERNAME] [PROJECT_PATH]

setlocal enabledelayedexpansion

REM Configuration
set "NAS_IP=%~1"
set "USERNAME=%~2"
set "PROJECT_PATH=%~3"
if "%NAS_IP%"=="" set "NAS_IP=your-nas-ip"
if "%USERNAME%"=="" set "USERNAME=your-username"
if "%PROJECT_PATH%"=="" set "PROJECT_PATH=/volume1/docker/dolonia-cloud"

REM Colors (using color codes)
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "RESET=[0m"

REM Logging functions
:log_info
echo %BLUE%[INFO]%RESET% %~1
goto :eof

:log_success
echo %GREEN%[SUCCESS]%RESET% %~1
goto :eof

:log_warning
echo %YELLOW%[WARNING]%RESET% %~1
goto :eof

:log_error
echo %RED%[ERROR]%RESET% %~1
goto :eof

REM Check prerequisites
:check_prerequisites
call :log_info "Checking prerequisites..."

REM Check if we're on Windows
ver | findstr /i "Windows" >nul
if errorlevel 1 (
    call :log_error "This script is designed for Windows"
    exit /b 1
)

REM Check if local project exists
if not exist "C:\Users\zionv\OneDrive\Desktop\dolonia-digital-ocean" (
    call :log_error "Local project path not found: C:\Users\zionv\OneDrive\Desktop\dolonia-digital-ocean"
    exit /b 1
)

REM Check for required tools (using where command)
where scp >nul 2>&1
if errorlevel 1 (
    call :log_error "scp is required but not found in PATH. Please install OpenSSH or Git Bash."
    exit /b 1
)

where ssh >nul 2>&1
if errorlevel 1 (
    call :log_error "ssh is required but not found in PATH. Please install OpenSSH or Git Bash."
    exit /b 1
)

call :log_success "Prerequisites check passed"
goto :eof

REM Upload files to NAS
:upload_files
call :log_info "Uploading project files to NAS..."

REM Create remote directory
ssh %USERNAME%@%NAS_IP% "mkdir -p %PROJECT_PATH%"

REM Upload files using scp (exclude node_modules and .git)
cd /d "C:\Users\zionv\OneDrive\Desktop\dolonia-digital-ocean"
scp -r . %USERNAME%@%NAS_IP%:%PROJECT_PATH%/ --exclude=node_modules --exclude=.git --exclude=.DS_Store --exclude=*.log

if errorlevel 1 (
    call :log_error "Failed to upload files"
    exit /b 1
)

call :log_success "Files uploaded successfully"
goto :eof

REM Deploy on NAS
:deploy_on_nas
call :log_info "Deploying application on NAS..."

REM Create deployment script on remote server
ssh %USERNAME%@%NAS_IP% "cat > %PROJECT_PATH%/deploy_remote.sh << 'EOF'
#!/bin/bash
set -e
cd \"%PROJECT_PATH%\"

echo \"Building and starting Docker containers...\"
docker-compose down || true
docker-compose up -d --build

echo \"Waiting for services to start...\"
sleep 10

echo \"Checking container status...\"
docker-compose ps

echo \"Testing health endpoint...\"
if curl -f http://localhost:8080/health >/dev/null 2>&1; then
    echo \"Health check passed!\"
else
    echo \"Warning: Health check failed\"
fi

echo \"Deployment completed successfully!\"
EOF"

REM Execute deployment script
ssh %USERNAME%@%NAS_IP% "chmod +x %PROJECT_PATH%/deploy_remote.sh && %PROJECT_PATH%/deploy_remote.sh"

if errorlevel 1 (
    call :log_error "Deployment failed on NAS"
    exit /b 1
)

call :log_success "Deployment completed on NAS"
goto :eof

REM Verify deployment
:verify_deployment
call :log_info "Verifying deployment..."

REM Test health endpoint
ssh %USERNAME%@%NAS_IP% "curl -f http://localhost:8080/health >/dev/null 2>&1"
if %errorlevel% equ 0 (
    call :log_success "Health check passed - application is running"
) else (
    call :log_warning "Health check failed - please check container logs"
)

REM Show container status
call :log_info "Container status:"
ssh %USERNAME%@%NAS_IP% "docker-compose ps"

REM Show access information
call :log_success "Application should be accessible at:"
echo   Local (on NAS): http://localhost:8080
echo   Network: http://%NAS_IP%:8080
echo   Health check: http://%NAS_IP%:8080/health
goto :eof

REM Main deployment function
:main
echo ==========================================
echo   Dolonia Cloud - SSH Deployment Script
echo ==========================================
echo.

REM Validate arguments
if "%NAS_IP%"=="your-nas-ip" (
    call :log_error "Please provide your NAS IP address as the first argument"
    echo Usage: %0 ^<NAS_IP^> [USERNAME] [PROJECT_PATH]
    echo Example: %0 192.168.1.100 admin /volume1/docker/dolonia-cloud
    exit /b 1
)

if "%USERNAME%"=="your-username" (
    call :log_error "Please provide your SSH username as the second argument"
    echo Usage: %0 ^<NAS_IP^> ^<USERNAME^> [PROJECT_PATH]
    exit /b 1
)

call :log_info "Deploying to: %USERNAME%@%NAS_IP%:%PROJECT_PATH%"
echo.

call :check_prerequisites
if errorlevel 1 exit /b 1

call :upload_files
if errorlevel 1 exit /b 1

call :deploy_on_nas
if errorlevel 1 exit /b 1

call :verify_deployment

echo.
call :log_success "Deployment completed successfully!"
call :log_info "Your Dolonia Cloud application is now running on your NAS"
goto :eof

REM Run main function
call :main %*