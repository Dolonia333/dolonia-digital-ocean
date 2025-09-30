#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Preparing WordPress theme for upload...');

const themeDir = path.join(__dirname, 'wordpress-theme');
const distDir = path.join(__dirname, 'dist');
const zipName = 'dolonia-cybersecurity-theme.zip';

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// First, build the WordPress assets
console.log('🔨 Building WordPress assets...');
try {
    execSync('npm run build:wordpress', { stdio: 'inherit', cwd: __dirname });
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}

// Create theme info and verify required files
const requiredFiles = [
    'style.css',
    'index.php',
    'functions.php',
    'header.php',
    'footer.php',
    'screenshot.png'
];

console.log('📋 Checking required WordPress theme files...');
const missingFiles = [];

requiredFiles.forEach(file => {
    const filePath = path.join(themeDir, file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - MISSING`);
        missingFiles.push(file);
    }
});

// Create missing critical files
if (missingFiles.includes('screenshot.png')) {
    console.log('📸 Creating theme screenshot...');
    // Create a simple screenshot file (you should replace this with an actual image)
    const screenshotContent = 'Theme screenshot placeholder - replace with actual 1200x900 PNG image';
    fs.writeFileSync(path.join(themeDir, 'screenshot.txt'), screenshotContent);
    console.log('⚠️  Created screenshot.txt placeholder - you should add a real screenshot.png (1200x900px)');
}

// Verify style.css has proper theme header
const styleCssPath = path.join(themeDir, 'style.css');
if (fs.existsSync(styleCssPath)) {
    const styleContent = fs.readFileSync(styleCssPath, 'utf8');
    if (!styleContent.includes('Theme Name:')) {
        console.log('📝 Adding WordPress theme header to style.css...');
        
        const themeHeader = `/*
Theme Name: Dolonia Cybersecurity
Description: Professional cybersecurity theme with dynamic binary rain animation, interactive live chat, and comprehensive business features. Built with React components and WordPress integration.
Version: 1.0.0
Author: Dolonia Digital
Author URI: https://dolonia.com
Tags: cybersecurity, business, professional, dark, animated, chat, react
Requires at least: 5.0
Tested up to: 6.4
Requires PHP: 7.4
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: dolonia

Dolonia Cybersecurity Theme
Copyright (C) 2025 Dolonia Digital

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.
*/

`;
        
        const newStyleContent = themeHeader + styleContent;
        fs.writeFileSync(styleCssPath, newStyleContent);
        console.log('✅ Theme header added to style.css');
    }
}

// Create README.txt for WordPress.org compliance
const readmeContent = `=== Dolonia Cybersecurity Theme ===
Contributors: doloniadigital
Tags: cybersecurity, business, professional, dark, animated, chat, react
Requires at least: 5.0
Tested up to: 6.4
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Professional cybersecurity theme with dynamic animations and interactive features.

== Description ==

Dolonia Cybersecurity Theme is a cutting-edge WordPress theme designed specifically for cybersecurity companies and IT professionals. It features:

* Dynamic binary rain animation with 6 different patterns
* Interactive live chat widget with analytics
* Customizable through WordPress Customizer
* Performance monitoring dashboard
* Lead generation tracking
* Mobile-responsive design
* SEO optimized
* Multiple color schemes

The theme includes advanced React components seamlessly integrated with WordPress, providing a modern user experience while maintaining easy content management.

== Features ==

* Binary Rain Animation: Choose from 6 patterns (fall, matrix, wave, spiral, glitch, cascade)
* Live Chat System: Built-in chat with conversation tracking
* Performance Optimization: Adaptive settings for different devices
* WordPress Customizer Integration: Real-time preview of changes
* Custom Post Types: Services, testimonials, case studies
* Analytics Dashboard: Track performance and user engagement
* Mobile Optimized: Responsive design for all devices
* Color Morphing: Dynamic color transitions in animations

== Installation ==

1. Upload the theme files to the /wp-content/themes/ directory
2. Activate the theme through the 'Appearance' menu in WordPress
3. Go to WordPress Admin > Dolonia to configure settings
4. Use the Customizer to adjust animations and chat settings

== Frequently Asked Questions ==

= Does this theme affect site performance? =
The theme includes performance monitoring and adaptive settings to ensure optimal performance across all devices.

= Can I disable the animations? =
Yes, all animations can be disabled or adjusted through the WordPress Customizer or admin panel.

= Is the theme SEO optimized? =
Yes, the theme follows WordPress SEO best practices and includes proper meta tags and structured data.

== Screenshots ==

1. Homepage with binary rain animation
2. Live chat widget in action
3. WordPress Customizer settings
4. Admin dashboard with analytics
5. Mobile responsive design

== Changelog ==

= 1.0.0 =
* Initial release
* Binary rain animation system
* Live chat integration
* WordPress Customizer support
* Performance monitoring
* Mobile optimization

== Credits ==

* Built with React and WordPress integration
* Uses ShadCN UI components
* Tailwind CSS for styling
* Font: Inter (Google Fonts)

== Support ==

For support and documentation, visit: https://dolonia.com/support
`;

fs.writeFileSync(path.join(themeDir, 'README.txt'), readmeContent);
console.log('✅ README.txt created');

// Check for includes directory
const includesDir = path.join(themeDir, 'includes');
if (!fs.existsSync(includesDir)) {
    fs.mkdirSync(includesDir, { recursive: true });
    console.log('📁 Created includes directory');
}

// List all files that will be included
console.log('\n📁 Theme package will include:');
function listFiles(dir, prefix = '') {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const relativePath = path.relative(themeDir, filePath);
        
        if (fs.statSync(filePath).isDirectory()) {
            console.log(`${prefix}📁 ${relativePath}/`);
            listFiles(filePath, prefix + '  ');
        } else {
            const size = fs.statSync(filePath).size;
            const sizeKB = (size / 1024).toFixed(1);
            console.log(`${prefix}📄 ${relativePath} (${sizeKB}KB)`);
        }
    });
}

listFiles(themeDir);

console.log('\n🎯 WordPress theme is ready!');
console.log('\n📋 Next steps:');
console.log('1. Add a screenshot.png file (1200x900px) to represent your theme');
console.log('2. Test the theme on a WordPress installation');
console.log('3. Create a ZIP file of the wordpress-theme folder');
console.log('4. Upload to WordPress through Appearance > Themes > Add New > Upload');

console.log('\n💡 To create ZIP file:');
console.log('   - On Windows: Right-click wordpress-theme folder > Send to > Compressed folder');
console.log('   - On Mac/Linux: zip -r dolonia-theme.zip wordpress-theme/');
console.log('   - Or use: 7zip, WinRAR, or any compression tool');

console.log('\n✅ WordPress theme package preparation complete!');