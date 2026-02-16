# Create deployment package with proper directory structure
Write-Host "🔧 Creating deployment package with proper directory structure..." -ForegroundColor Cyan

# Remove old packages
Remove-Item "DOLONIA-PROPER-STRUCTURE.zip" -Force -ErrorAction SilentlyContinue

# Load System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

# Create new zip file
$zipPath = "DOLONIA-PROPER-STRUCTURE.zip"
$zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Create')

# Function to add directory recursively
function Add-DirectoryToZip($zip, $sourcePath, $entryName) {
    if (Test-Path $sourcePath -PathType Container) {
        # Add directory entry
        $dirEntry = $zip.CreateEntry("$entryName/")

        # Add all files in directory
        Get-ChildItem $sourcePath -Recurse -File | ForEach-Object {
            $relativePath = $_.FullName.Substring($sourcePath.Length + 1)
            $entryPath = "$entryName/$($relativePath.Replace('\', '/'))"
            Write-Host "  Adding: $entryPath" -ForegroundColor Gray

            $entry = $zip.CreateEntry($entryPath)
            $entryStream = $entry.Open()
            $fileStream = [System.IO.File]::OpenRead($_.FullName)
            $fileStream.CopyTo($entryStream)
            $fileStream.Close()
            $entryStream.Close()
        }
    }
}

# Function to add single file
function Add-FileToZip($zip, $filePath, $entryName) {
    if (Test-Path $filePath -PathType Leaf) {
        Write-Host "  Adding file: $entryName" -ForegroundColor Gray
        $entry = $zip.CreateEntry($entryName)
        $entryStream = $entry.Open()
        $fileStream = [System.IO.File]::OpenRead($filePath)
        $fileStream.CopyTo($entryStream)
        $fileStream.Close()
        $entryStream.Close()
    }
}

Write-Host "📁 Adding directories..." -ForegroundColor Yellow
Add-DirectoryToZip $zip "src" "src"
Add-DirectoryToZip $zip "public" "public"
Add-DirectoryToZip $zip ".vscode" ".vscode"

Write-Host "📄 Adding root files..." -ForegroundColor Yellow
$rootFiles = @(
    "package.json", "package-lock.json", "vite.config.ts", "tsconfig.json",
    "tsconfig.app.json", "tsconfig.node.json", "tailwind.config.ts",
    "postcss.config.js", "components.json", "index.html", "Dockerfile",
    "nginx.conf", ".dockerignore", "docker-compose.yml", ".env",
    ".env.template", "supabase-schema.sql", "supabase-rls.sql",
    "supabase-sample-data.sql", "eslint.config.js", ".gitignore"
)

foreach ($file in $rootFiles) {
    Add-FileToZip $zip $file $file
}

$zip.Dispose()

$finalSize = (Get-Item $zipPath).Length / 1MB
Write-Host "✅ Package created: $zipPath ($([math]::Round($finalSize, 2)) MB)" -ForegroundColor Green
