# Create deployment package with proper directory structure using Windows tar (bsdtar)
Write-Host "🔧 Creating deployment package with proper directory structure..." -ForegroundColor Cyan

$zipPath = "DOLONIA-FINAL-DEPLOY.zip"
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

$items = @(
    "src",
    "public",
    ".vscode",
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
    ".env",
    ".env.template",
    "supabase-schema.sql",
    "supabase-rls.sql",
    "supabase-sample-data.sql",
    "eslint.config.js",
    ".gitignore"
)

# Use Windows bundled bsdtar via `tar -a` to produce a zip archive while preserving folder structure
& tar -a -c -f $zipPath @items

if (-not (Test-Path $zipPath)) {
    Write-Host "❌ Failed to create $zipPath" -ForegroundColor Red
    exit 1
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
$srcCount = ($zip.Entries | Where-Object { $_.FullName -like 'src/*' }).Count
$publicCount = ($zip.Entries | Where-Object { $_.FullName -like 'public/*' }).Count
$totalEntries = $zip.Entries.Count
$zip.Dispose()

$sizeMb = [Math]::Round((Get-Item $zipPath).Length / 1MB, 2)
Write-Host ("Package created: {0}" -f $zipPath) -ForegroundColor Green
Write-Host ("SizeMB: {0}" -f $sizeMb) -ForegroundColor Green
Write-Host ("Entries: {0} | src: {1} | public: {2}" -f $totalEntries, $srcCount, $publicCount) -ForegroundColor Yellow