# Create PC Supabase + NAS Website Package
Write-Host "Creating PC Supabase + NAS Website deployment package..." -ForegroundColor Green

# Clean up
Remove-Item "dolonia-pc-supabase-nas.zip" -Force -ErrorAction SilentlyContinue
Remove-Item "pc-nas-temp" -Recurse -Force -ErrorAction SilentlyContinue

# Create temp directory
New-Item -ItemType Directory -Path "pc-nas-temp" | Out-Null

Write-Host "Copying files for PC Supabase + NAS Website setup..." -ForegroundColor Yellow

# Core files
Copy-Item "src","public" -Destination "pc-nas-temp" -Recurse
$configFiles = @(
    "package.json", "package-lock.json", "vite.config.ts",
    "tsconfig.json", "tsconfig.app.json", "tsconfig.node.json", 
    "tailwind.config.ts", "postcss.config.js", "components.json", "index.html"
)
foreach ($file in $configFiles) {
    if (Test-Path $file) { Copy-Item $file -Destination "pc-nas-temp/" }
}

# Docker files
Copy-Item "Dockerfile","Dockerfile.vite","nginx.conf",".dockerignore","docker-compose.yml" -Destination "pc-nas-temp/"

# PC + NAS specific files
Copy-Item ".env.nas-to-pc" -Destination "pc-nas-temp/.env.template"
Copy-Item "deploy-nas-pc-supabase.sh" -Destination "pc-nas-temp/"
Copy-Item "PC-SUPABASE-NAS-WEBSITE-GUIDE.md" -Destination "pc-nas-temp/README.md"

Write-Host "Creating deployment package..." -ForegroundColor Yellow

# Create ZIP
Compress-Archive -Path "pc-nas-temp/*" -DestinationPath "dolonia-pc-supabase-nas.zip" -Force

# Cleanup
Remove-Item "pc-nas-temp" -Recurse -Force

# Results
$zipSize = (Get-Item "dolonia-pc-supabase-nas.zip").Length / 1MB
Write-Host ""
Write-Host "PC Supabase + NAS Website package created!" -ForegroundColor Green
Write-Host "File: dolonia-pc-supabase-nas.zip" -ForegroundColor Cyan
Write-Host "Size: $([math]::Round($zipSize, 2)) MB" -ForegroundColor Cyan
Write-Host ""
Write-Host "DEPLOYMENT ARCHITECTURE:" -ForegroundColor Green
Write-Host "- PC: Runs Supabase (10.15.20.207:54321)" -ForegroundColor Yellow
Write-Host "- NAS: Runs Website (Docker container)" -ForegroundColor Yellow  
Write-Host "- Connection: NAS website -> PC database" -ForegroundColor Yellow
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Green
Write-Host "1. Keep Supabase running on PC: supabase start" -ForegroundColor Yellow
Write-Host "2. Upload dolonia-pc-supabase-nas.zip to NAS" -ForegroundColor Yellow
Write-Host "3. Extract and run: ./deploy-nas-pc-supabase.sh" -ForegroundColor Yellow
Write-Host "4. Access website at http://your-nas-ip" -ForegroundColor Yellow