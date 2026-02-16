# Simple Docker package creator
Write-Host "Creating Docker deployment package..." -ForegroundColor Green

# Define files to include
$filesToInclude = @(
    "src",
    "public",
    "package.json",
    "package-lock.json",
    "vite.config.ts",
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.node.json",
    "tailwind.config.ts",
    "postcss.config.js",
    "components.json",
    "index.html",
    "Dockerfile",
    "nginx.conf",
    ".dockerignore",
    "docker-compose.yml",
    "deploy.sh",
    "deploy.ps1"
)

# Check which files exist
$existingFiles = @()
foreach ($file in $filesToInclude) {
    if (Test-Path $file) {
        $existingFiles += $file
        Write-Host "Found: $file" -ForegroundColor Green
    } else {
        Write-Host "Missing: $file" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Found $($existingFiles.Count) files/folders to package" -ForegroundColor Cyan

# Create deployment instructions
$instructions = @"
# Dolonia Digital Ocean - Docker Deployment Instructions

## Files Included:
$($existingFiles -join "`n")

## Deployment Steps:

1. **Upload all files** to your NAS/server in a new directory
2. **Create .env file** with your environment variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   VITE_API_URL=your_api_url_here
   ```

3. **Build and run the Docker container:**

   ### Option A: Using deployment script (Linux/NAS)
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

   ### Option B: Using deployment script (Windows)
   ```powershell
   ./deploy.ps1
   ```

   ### Option C: Manual Docker commands
   ```bash
   # Build the image
   docker build -t dolonia-web:latest .

   # Run the container
   docker run -d --name dolonia-web -p 80:80 --restart unless-stopped dolonia-web:latest
   ```

   ### Option D: Using Docker Compose
   ```bash
   docker-compose up -d
   ```

## Access Your Site:
After deployment, your site will be available at:
- http://your-nas-ip
- http://localhost (if running locally)

## Troubleshooting:
```bash
# Check container status
docker ps

# View logs
docker logs dolonia-web

# Stop container
docker stop dolonia-web

# Remove container
docker rm dolonia-web
```

## Notes:
- The application will run on port 80
- All static assets are optimized for production
- Nginx is configured for React Router client-side routing
- Container will auto-restart if it crashes
"@

$instructions | Out-File "DEPLOYMENT_INSTRUCTIONS.txt" -Encoding UTF8

Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Green
Write-Host "1. Manually copy these files to your NAS:" -ForegroundColor Yellow
Write-Host "   - All source files (src/, public/, package.json, etc.)" -ForegroundColor White
Write-Host "   - All Docker files (Dockerfile, nginx.conf, etc.)" -ForegroundColor White
Write-Host "   - Deployment scripts (deploy.sh, deploy.ps1)" -ForegroundColor White
Write-Host ""
Write-Host "2. Follow the instructions in DEPLOYMENT_INSTRUCTIONS.txt" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Or use the manual docker commands shown above" -ForegroundColor Yellow
