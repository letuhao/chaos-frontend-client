#!/usr/bin/env node

/**
 * Unity Build Script
 * Builds Unity WebGL project with mobile optimization
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class UnityBuilder {
    constructor() {
        this.unityPath = this.getUnityPath();
        this.projectPath = path.resolve(__dirname, '../unity-project');
        this.buildPath = path.resolve(__dirname, '../builds/webgl');
        this.config = this.loadConfig();
    }
    
    getUnityPath() {
        const os = process.platform;
        let unityPath;
        
        switch (os) {
            case 'win32':
                unityPath = 'C:\\Program Files\\Unity\\Hub\\Editor\\2023.3.0f1\\Editor\\Unity.exe';
                break;
            case 'darwin':
                unityPath = '/Applications/Unity/Hub/Editor/2023.3.0f1/Unity.app/Contents/MacOS/Unity';
                break;
            case 'linux':
                unityPath = '/opt/Unity/Editor/Unity';
                break;
            default:
                throw new Error(`Unsupported platform: ${os}`);
        }
        
        if (!fs.existsSync(unityPath)) {
            throw new Error(`Unity not found at: ${unityPath}`);
        }
        
        return unityPath;
    }
    
    loadConfig() {
        const configPath = path.resolve(__dirname, '../config/unity-config.json');
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    
    async build() {
        try {
            console.log('🎮 Starting Unity WebGL build...');
            
            // Clean build directory
            this.cleanBuildDirectory();
            
            // Build Unity project
            await this.buildUnityProject();
            
            // Copy web assets
            this.copyWebAssets();
            
            // Optimize build
            this.optimizeBuild();
            
            console.log('✅ Unity build completed successfully!');
            
        } catch (error) {
            console.error('❌ Unity build failed:', error.message);
            process.exit(1);
        }
    }
    
    cleanBuildDirectory() {
        console.log('🧹 Cleaning build directory...');
        
        if (fs.existsSync(this.buildPath)) {
            fs.rmSync(this.buildPath, { recursive: true, force: true });
        }
        
        fs.mkdirSync(this.buildPath, { recursive: true });
    }
    
    async buildUnityProject() {
        console.log('🔨 Building Unity project...');
        
        const buildCommand = `"${this.unityPath}" -batchmode -quit -projectPath "${this.projectPath}" -buildTarget WebGL -executeMethod BuildScript.BuildWebGL -logFile -`;
        
        try {
            execSync(buildCommand, { 
                stdio: 'inherit',
                cwd: this.projectPath
            });
        } catch (error) {
            throw new Error(`Unity build failed: ${error.message}`);
        }
    }
    
    copyWebAssets() {
        console.log('📁 Copying web assets...');
        
        const webAssetsPath = path.resolve(__dirname, '../web-assets/dist');
        const sourcePath = path.resolve(__dirname, '../web-assets/src');
        
        // Copy built web assets if they exist, otherwise copy source
        const assetsToCopy = fs.existsSync(webAssetsPath) ? webAssetsPath : sourcePath;
        
        this.copyDirectory(assetsToCopy, this.buildPath);
    }
    
    copyDirectory(src, dest) {
        if (!fs.existsSync(src)) {
            console.warn(`Source directory does not exist: ${src}`);
            return;
        }
        
        const entries = fs.readdirSync(src, { withFileTypes: true });
        
        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            
            if (entry.isDirectory()) {
                fs.mkdirSync(destPath, { recursive: true });
                this.copyDirectory(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }
    
    optimizeBuild() {
        console.log('⚡ Optimizing build...');
        
        // Optimize images
        this.optimizeImages();
        
        // Minify CSS and JS
        this.minifyAssets();
        
        // Generate service worker
        this.generateServiceWorker();
        
        // Generate manifest
        this.generateManifest();
    }
    
    optimizeImages() {
        const imagesPath = path.join(this.buildPath, 'static/images');
        
        if (fs.existsSync(imagesPath)) {
            console.log('🖼️ Optimizing images...');
            // Add image optimization logic here
            // This could use tools like imagemin
        }
    }
    
    minifyAssets() {
        console.log('📦 Minifying assets...');
        // Add minification logic here
        // This could use tools like terser, cssnano, etc.
    }
    
    generateServiceWorker() {
        console.log('🔧 Generating service worker...');
        
        const swContent = `
const CACHE_NAME = 'chaos-world-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/main.css',
    '/css/mobile.css',
    '/js/game-ui.js',
    '/js/unity-bridge.js',
    '/js/steam-integration.js',
    '/Build/UnityLoader.js',
    '/Build/chaos-world.data',
    '/Build/chaos-world.wasm',
    '/Build/chaos-world.framework.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});
        `;
        
        fs.writeFileSync(path.join(this.buildPath, 'sw.js'), swContent);
    }
    
    generateManifest() {
        console.log('📱 Generating PWA manifest...');
        
        const manifest = {
            name: 'Chaos World',
            short_name: 'ChaosWorld',
            description: 'A cultivation RPG inspired by Tale of Immortal',
            start_url: '/',
            display: 'standalone',
            background_color: '#000000',
            theme_color: '#1a1a2e',
            orientation: 'landscape',
            icons: [
                {
                    src: 'static/images/icon-192x192.png',
                    sizes: '192x192',
                    type: 'image/png'
                },
                {
                    src: 'static/images/icon-512x512.png',
                    sizes: '512x512',
                    type: 'image/png'
                }
            ],
            categories: ['games', 'entertainment'],
            lang: 'en',
            dir: 'ltr'
        };
        
        fs.writeFileSync(
            path.join(this.buildPath, 'manifest.json'),
            JSON.stringify(manifest, null, 2)
        );
    }
}

// Run build if called directly
if (require.main === module) {
    const builder = new UnityBuilder();
    builder.build().catch(console.error);
}

module.exports = UnityBuilder;
