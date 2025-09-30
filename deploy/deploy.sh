#!/bin/bash

# Dolonia Cloud - Automated SSH Deployment Script
# Usage: ./deploy.sh [NAS_IP] [USERNAME] [PROJECT_PATH]

set -e  # Exit on any error

# Configuration
NAS_IP="${1:-your-nas-ip}"
USERNAME="${2:-your-username}"
PROJECT_PATH="${3:-/volume1/docker/dolonia-cloud}"
LOCAL_PROJECT_PATH="C:\Users\zionv\OneDrive\Desktop\dolonia-digital-ocean"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check if we're on Windows
    if [[ "$OSTYPE" != "msys" && "$OSTYPE" != "win32" ]]; then
        log_error "This script is designed for Windows with PowerShell/WSL"
        exit 1
    fi

    # Check if local project exists
    if [[ ! -d "$LOCAL_PROJECT_PATH" ]]; then
        log_error "Local project path not found: $LOCAL_PROJECT_PATH"
        exit 1
    fi

    # Check for required tools
    command -v scp >/dev/null 2>&1 || { log_error "scp is required but not installed."; exit 1; }
    command -v ssh >/dev/null 2>&1 || { log_error "ssh is required but not installed."; exit 1; }

    log_success "Prerequisites check passed"
}

# Upload files to NAS
upload_files() {
    log_info "Uploading project files to NAS..."

    # Create remote directory
    ssh "$USERNAME@$NAS_IP" "mkdir -p $PROJECT_PATH"

    # Upload files using scp (exclude node_modules and .git)
    cd "$LOCAL_PROJECT_PATH"
    scp -r . "$USERNAME@$NAS_IP:$PROJECT_PATH/" \
        --exclude=node_modules \
        --exclude=.git \
        --exclude=.DS_Store \
        --exclude=*.log

    log_success "Files uploaded successfully"
}

# Deploy on NAS
deploy_on_nas() {
    log_info "Deploying application on NAS..."

    ssh "$USERNAME@$NAS_IP" << EOF
        set -e
        cd "$PROJECT_PATH"

        echo "Building and starting Docker containers..."
        docker-compose down || true
        docker-compose up -d --build

        echo "Waiting for services to start..."
        sleep 10

        echo "Checking container status..."
        docker-compose ps

        echo "Testing health endpoint..."
        if curl -f http://localhost:8080/health >/dev/null 2>&1; then
            echo "Health check passed!"
        else
            echo "Warning: Health check failed"
        fi

        echo "Deployment completed successfully!"
EOF

    log_success "Deployment completed on NAS"
}

# Verify deployment
verify_deployment() {
    log_info "Verifying deployment..."

    # Test health endpoint
    if ssh "$USERNAME@$NAS_IP" "curl -f http://localhost:8080/health >/dev/null 2>&1"; then
        log_success "Health check passed - application is running"
    else
        log_warning "Health check failed - please check container logs"
    fi

    # Show container status
    log_info "Container status:"
    ssh "$USERNAME@$NAS_IP" "docker-compose ps"

    # Show access information
    log_success "Application should be accessible at:"
    echo "  Local (on NAS): http://localhost:8080"
    echo "  Network: http://$NAS_IP:8080"
    echo "  Health check: http://$NAS_IP:8080/health"
}

# Main deployment function
main() {
    echo "=========================================="
    echo "  Dolonia Cloud - SSH Deployment Script"
    echo "=========================================="
    echo ""

    # Validate arguments
    if [[ "$NAS_IP" == "your-nas-ip" ]]; then
        log_error "Please provide your NAS IP address as the first argument"
        echo "Usage: $0 <NAS_IP> [USERNAME] [PROJECT_PATH]"
        echo "Example: $0 192.168.1.100 admin /volume1/docker/dolonia-cloud"
        exit 1
    fi

    if [[ "$USERNAME" == "your-username" ]]; then
        log_error "Please provide your SSH username as the second argument"
        echo "Usage: $0 <NAS_IP> <USERNAME> [PROJECT_PATH]"
        exit 1
    fi

    log_info "Deploying to: $USERNAME@$NAS_IP:$PROJECT_PATH"
    echo ""

    check_prerequisites
    upload_files
    deploy_on_nas
    verify_deployment

    echo ""
    log_success "🎉 Deployment completed successfully!"
    log_info "Your Dolonia Cloud application is now running on your NAS"
}

# Handle script interruption
trap 'log_error "Deployment interrupted by user"; exit 1' INT TERM

# Run main function
main "$@"