#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Creating WordPress theme ZIP file...');

const themeDir = path.join(__dirname, 'dolonia-cloud');
const distDir = path.join(__dirname, 'dist');
const zipName = 'dolonia-cloud-theme.zip';
const zipPath = path.join(distDir, zipName);

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Run theme preparation first
console.log('🔧 Preparing theme...');
try {
    execSync('npm run prepare:theme', { stdio: 'inherit', cwd: __dirname });
} catch (error) {
    console.error('❌ Theme preparation failed:', error.message);
    process.exit(1);
}

// Create ZIP file using PowerShell on Windows
console.log('🗜️ Creating ZIP archive...');

try {
    // Remove existing ZIP if it exists
    if (fs.existsSync(zipPath)) {
        fs.unlinkSync(zipPath);
        console.log('🗑️ Removed existing ZIP file');
    }

    // Use PowerShell Compress-Archive on Windows
    const powershellCommand = `Compress-Archive -Path "${themeDir}\\*" -DestinationPath "${zipPath}" -Force`;
    execSync(powershellCommand, { shell: 'powershell', stdio: 'inherit' });
    
    console.log('✅ ZIP file created successfully!');
    
    // Get file size
    const stats = fs.statSync(zipPath);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log(`📁 File: ${zipPath}`);
    console.log(`📏 Size: ${fileSizeInMB} MB`);
    
} catch (error) {
    console.error('❌ ZIP creation failed:', error.message);
    console.log('\n💡 Manual ZIP creation:');
    console.log('1. Navigate to the project folder');
    console.log('2. Right-click the "wordpress-theme" folder');
    console.log('3. Select "Send to" > "Compressed (zipped) folder"');
    console.log('4. Rename to "dolonia-cybersecurity-theme.zip"');
    process.exit(1);
}

console.log('\n🎉 WordPress theme is ready for upload!');
console.log('\n📋 Installation instructions:');
console.log('1. Log into your WordPress admin panel');
console.log('2. Go to Appearance > Themes');
console.log('3. Click "Add New" then "Upload Theme"');
console.log('4. Choose the ZIP file and click "Install Now"');
console.log('5. Click "Activate" to enable the theme');
console.log('6. Go to WordPress Admin > Dolonia to configure settings');
console.log('7. Use Appearance > Customize to adjust animations and chat');

console.log('\n🔧 Theme Features:');
console.log('• Dynamic binary rain with 6 animation patterns');
console.log('• Interactive live chat with analytics');
console.log('• WordPress Customizer integration');
console.log('• Performance monitoring dashboard');
console.log('• Mobile-responsive design');
console.log('• Custom post types for services/testimonials');
console.log('• Lead generation tracking');

console.log('\n✨ Your cybersecurity WordPress theme is ready to go!');