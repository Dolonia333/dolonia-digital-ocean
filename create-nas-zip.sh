#!/bin/bash
# Dolonia NAS Deployment Package Creator
# This script creates a ZIP file with everything needed for NAS deployment

echo "🚀 Creating NAS deployment package..."

# Clean up
rm -f dolonia-nas-deploy.zip
rm -rf nas-deploy-temp

# Create temp directory
mkdir -p nas-deploy-temp

echo "📦 Copying files..."

# Core files
cp -r src nas-deploy-temp/
cp -r public nas-deploy-temp/ 2>/dev/null || true

# Configuration
cp package.json nas-deploy-temp/
cp package-lock.json nas-deploy-temp/
cp vite.config.ts nas-deploy-temp/
cp tsconfig*.json nas-deploy-temp/
cp tailwind.config.* nas-deploy-temp/ 2>/dev/null || true
cp postcss.config.js nas-deploy-temp/
cp components.json nas-deploy-temp/ 2>/dev/null || true
cp index.html nas-deploy-temp/

# Docker files
cp Dockerfile nas-deploy-temp/
cp nginx.conf nas-deploy-temp/
cp .dockerignore nas-deploy-temp/
cp docker-compose.yml nas-deploy-temp/

# Documentation
cp NAS-DEPLOYMENT-GUIDE.md nas-deploy-temp/README.md

# Create .env template
cat > nas-deploy-temp/.env.example << 'EOF'
# Dolonia Environment Variables
# Copy this file to .env and update with your credentials

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
EOF

# Create quick deploy script
cat > nas-deploy-temp/deploy.sh << 'EOF'
#!/bin/bash
echo "🚀 Deploying Dolonia to NAS..."

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker."
    exit 1
fi

# Check .env
if [ ! -f ".env" ]; then
    echo "⚠️  .env file missing!"
    echo "Creating from template..."
    cp .env.example .env
    echo "📝 Please edit .env with your Supabase credentials"
    echo "Then run this script again."
    exit 1
fi

# Build and deploy
echo "📦 Building Docker image..."
docker-compose up -d --build

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Access at: http://$(hostname -I | awk '{print $1}'):8080"
else
    echo "❌ Deployment failed!"
    exit 1
fi
EOF

chmod +x nas-deploy-temp/deploy.sh

# Create the ZIP
echo "🗜️  Creating ZIP archive..."
cd nas-deploy-temp
zip -r ../dolonia-nas-deploy.zip . -q
cd ..

# Cleanup
rm -rf nas-deploy-temp

# Show results
SIZE=$(du -h dolonia-nas-deploy.zip | cut -f1)
echo ""
echo "✅ SUCCESS! Package created: dolonia-nas-deploy.zip"
echo "📏 Size: $SIZE"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Transfer dolonia-nas-deploy.zip to your NAS"
echo "2. Extract it: unzip dolonia-nas-deploy.zip"
echo "3. Create .env file with your Supabase credentials"
echo "4. Run: chmod +x deploy.sh && ./deploy.sh"
echo "5. Access at: http://[NAS-IP]:8080"
echo ""
