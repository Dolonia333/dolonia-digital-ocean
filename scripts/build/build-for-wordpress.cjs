#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔨 Building React components for WordPress...');

// Create the WordPress assets directory structure
const assetsDir = path.join(__dirname, 'dolonia-cloud', 'assets');
const distDir = path.join(assetsDir, 'dist');

if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Copy CSS files
const cssSource = path.join(__dirname, 'src', 'index.css');
const cssTarget = path.join(distDir, 'style.css');

if (fs.existsSync(cssSource)) {
    fs.copyFileSync(cssSource, cssTarget);
    console.log('✅ CSS files copied to WordPress theme');
} else {
    console.log('⚠️  CSS source file not found');
}

// Copy the binary rain JavaScript file
const jsSource = path.join(__dirname, 'dolonia-cloud', 'js', 'binary-rain-wp.js');
const jsTarget = path.join(distDir, 'binary-rain.js');

if (fs.existsSync(jsSource)) {
    fs.copyFileSync(jsSource, jsTarget);
    console.log('✅ Binary rain JavaScript copied');
} else {
    console.log('⚠️  Binary rain JavaScript not found');
}

// Create a simple main.js file for WordPress integration
const mainJsContent = `
// WordPress integration main file
console.log('Dolonia WordPress theme loaded');

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Dolonia components...');
    
    // Binary rain will be initialized by binary-rain-wp.js
    // Live chat initialization would go here
    
    console.log('Dolonia components initialized');
});
`;

fs.writeFileSync(path.join(distDir, 'main.js'), mainJsContent);
console.log('✅ Main JavaScript file created');

console.log('✅ WordPress build complete!');
console.log('📁 Files created in: dolonia-cloud/assets/dist/');