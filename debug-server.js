#!/usr/bin/env node

/**
 * Debug Server Script
 * Helps debug webpack dev server issues
 */

const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

console.log('🔍 Starting Debug Session...\n');

// Check if build directory exists
const buildDir = path.join(__dirname, 'builds/webgl');
console.log('📁 Checking build directory:', buildDir);

if (fs.existsSync(buildDir)) {
    console.log('✅ Build directory exists');
    const files = fs.readdirSync(buildDir);
    console.log('📄 Files in build directory:', files);
    
    // Check if index.html exists
    const indexPath = path.join(buildDir, 'index.html');
    if (fs.existsSync(indexPath)) {
        console.log('✅ index.html exists');
        const content = fs.readFileSync(indexPath, 'utf8');
        console.log('📄 index.html size:', content.length, 'bytes');
        console.log('📄 index.html preview:', content.substring(0, 200) + '...');
    } else {
        console.log('❌ index.html not found');
    }
} else {
    console.log('❌ Build directory does not exist');
}

console.log('\n🚀 Starting webpack dev server with debug info...\n');

// Start webpack dev server with debug info
const webpackProcess = spawn('npx', ['webpack', 'serve', '--mode', 'development', '--progress'], {
    stdio: 'inherit',
    shell: true
});

webpackProcess.on('error', (error) => {
    console.error('❌ Failed to start webpack dev server:', error);
});

webpackProcess.on('close', (code) => {
    console.log(`\n📊 Webpack dev server exited with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🛑 Stopping debug session...');
    webpackProcess.kill('SIGINT');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Stopping debug session...');
    webpackProcess.kill('SIGTERM');
    process.exit(0);
});
