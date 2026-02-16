@echo off
echo Creating deployment package with proper directory structure...

REM Remove old packages
del "DOLONIA-FINAL-CORRECT.zip" 2>nul

REM Create the package using PowerShell with explicit directory preservation
powershell -Command "& {Add-Type -AssemblyName 'System.IO.Compression.FileSystem'; [System.IO.Compression.ZipFile]::CreateFromDirectory('.', 'DOLONIA-TEMP-ALL.zip', 'Optimal', $false); $source = [System.IO.Compression.ZipFile]::OpenRead('DOLONIA-TEMP-ALL.zip'); $dest = [System.IO.Compression.ZipFile]::Open('DOLONIA-FINAL-CORRECT.zip', 'Create'); $include = @('src/', 'public/', '.vscode/', 'package.json', 'package-lock.json', 'vite.config.ts', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json', 'tailwind.config.ts', 'postcss.config.js', 'components.json', 'index.html', 'Dockerfile', 'nginx.conf', '.dockerignore', 'docker-compose.yml', '.env', '.env.template', 'supabase-schema.sql', 'supabase-rls.sql', 'supabase-sample-data.sql', 'eslint.config.js', '.gitignore'); foreach($entry in $source.Entries) { $shouldInclude = $false; foreach($pattern in $include) { if($pattern.EndsWith('/')) { if($entry.FullName.StartsWith($pattern) -or $entry.FullName -eq $pattern.TrimEnd('/')) { $shouldInclude = $true; break } } else { if($entry.FullName -eq $pattern) { $shouldInclude = $true; break } } } if($shouldInclude) { $newEntry = $dest.CreateEntry($entry.FullName); $sourceStream = $entry.Open(); $destStream = $newEntry.Open(); $sourceStream.CopyTo($destStream); $sourceStream.Close(); $destStream.Close() } }; $source.Dispose(); $dest.Dispose(); Remove-Item 'DOLONIA-TEMP-ALL.zip'}"

echo Verifying package structure...
powershell -Command "& {Add-Type -AssemblyName 'System.IO.Compression.FileSystem'; $zip = [System.IO.Compression.ZipFile]::OpenRead('DOLONIA-FINAL-CORRECT.zip'); $srcCount = ($zip.Entries | Where-Object { $_.FullName -like 'src/*' }).Count; $publicCount = ($zip.Entries | Where-Object { $_.FullName -like 'public/*' }).Count; $totalCount = $zip.Entries.Count; Write-Host 'Package verification:' -ForegroundColor Yellow; Write-Host '  Total files: $totalCount' -ForegroundColor White; Write-Host '  src/ files: $srcCount' -ForegroundColor Green; Write-Host '  public/ files: $publicCount' -ForegroundColor Green; $zip.Dispose()}"

echo.
echo ✅ DOLONIA-FINAL-CORRECT.zip created with proper directory structure!
