#!/bin/bash
# Dolonia Cloud - Container Manager Deployment Script
# This script builds and exports your React app as a Docker image for NAS deployment

set -e  # Exit on any error

echo "🚀 Building Dolonia Cloud for Container Manager deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if we're in the project root
if [ ! -f "package.json" ] || [ ! -f "vite.config.ts" ]; then
    print_error "Please run this script from the Dolonia Cloud project root directory."
    exit 1
fi

print_status "Installing dependencies..."
npm ci

print_status "Building production bundle..."
npm run build

print_status "Building Docker image..."
docker build -f deploy/Dockerfile -t dolonia-cloud:latest .

print_status "Exporting Docker image for Container Manager..."
docker save dolonia-cloud:latest -o deploy/dolonia-cloud.tar

print_success "✅ Dolonia Cloud Docker image exported successfully!"
print_success "📦 File location: deploy/dolonia-cloud.tar"
print_success "📏 File size: $(ls -lh deploy/dolonia-cloud.tar | awk '{print $5}')"

echo ""
print_status "📋 Next steps for Container Manager:"
echo "  1. Open your NAS Container Manager"
echo "  2. Go to Image → Import"
echo "  3. Upload deploy/dolonia-cloud.tar"
echo "  4. Create a new Container from the dolonia-cloud image"
echo "  5. Map container port 80 to NAS port (e.g., 8080)"
echo "  6. Access at: http://<your-nas-ip>:8080"
echo ""

print_warning "💡 Pro tip: The container includes health checks for monitoring"
print_warning "🔒 Security headers and gzip compression are enabled"
print_warning "🎨 Favicon caching is optimized for your Dolonia logo"

echo ""
print_success "🎉 Ready for Container Manager deployment!"