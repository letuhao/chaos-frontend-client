#!/usr/bin/env node

/**
 * Deployment Script
 * Deploys the built game to various platforms
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class GameDeployer {
    constructor() {
        this.buildPath = path.resolve(__dirname, '../builds/webgl');
        this.config = this.loadConfig();
    }
    
    loadConfig() {
        const configPath = path.resolve(__dirname, '../config/netlify.toml');
        return fs.existsSync(configPath) ? fs.readFileSync(configPath, 'utf8') : null;
    }
    
    async deploy() {
        try {
            console.log('🚀 Starting deployment...');
            
            // Check if build exists
            if (!fs.existsSync(this.buildPath)) {
                throw new Error('Build directory not found. Run build first.');
            }
            
            // Deploy to Netlify
            await this.deployToNetlify();
            
            // Deploy to Steam (if configured)
            await this.deployToSteam();
            
            console.log('✅ Deployment completed successfully!');
            
        } catch (error) {
            console.error('❌ Deployment failed:', error.message);
            process.exit(1);
        }
    }
    
    async deployToNetlify() {
        console.log('🌐 Deploying to Netlify...');
        
        try {
            // Check if Netlify CLI is installed
            execSync('netlify --version', { stdio: 'pipe' });
            
            // Deploy to Netlify
            execSync(`netlify deploy --prod --dir="${this.buildPath}"`, {
                stdio: 'inherit'
            });
            
            console.log('✅ Netlify deployment successful!');
            
        } catch (error) {
            console.warn('⚠️ Netlify deployment failed:', error.message);
            console.log('💡 Install Netlify CLI: npm install -g netlify-cli');
        }
    }
    
    async deployToSteam() {
        console.log('🎮 Preparing Steam deployment...');
        
        const steamConfigPath = path.resolve(__dirname, '../config/steam-config.json');
        
        if (!fs.existsSync(steamConfigPath)) {
            console.log('ℹ️ Steam config not found, skipping Steam deployment');
            return;
        }
        
        const steamConfig = JSON.parse(fs.readFileSync(steamConfigPath, 'utf8'));
        
        if (!steamConfig.steam.appId || steamConfig.steam.appId === 'YOUR_STEAM_APP_ID') {
            console.log('ℹ️ Steam App ID not configured, skipping Steam deployment');
            return;
        }
        
        // Create Steam build
        const steamBuildPath = path.resolve(__dirname, '../builds/steam');
        
        if (!fs.existsSync(steamBuildPath)) {
            fs.mkdirSync(steamBuildPath, { recursive: true });
        }
        
        // Copy WebGL build to Steam build
        this.copyDirectory(this.buildPath, steamBuildPath);
        
        // Add Steam-specific files
        this.addSteamFiles(steamBuildPath, steamConfig);
        
        console.log('✅ Steam build prepared!');
        console.log('💡 Upload to Steam using Steamworks SDK');
    }
    
    addSteamFiles(steamBuildPath, steamConfig) {
        // Create steam_appid.txt
        fs.writeFileSync(
            path.join(steamBuildPath, 'steam_appid.txt'),
            steamConfig.steam.appId
        );
        
        // Create Steam configuration
        const steamConfigContent = {
            steam: steamConfig.steam,
            achievements: steamConfig.achievements,
            cloudSaves: steamConfig.cloudSaves,
            friends: steamConfig.friends,
            webgl: steamConfig.webgl
        };
        
        fs.writeFileSync(
            path.join(steamBuildPath, 'steam-config.json'),
            JSON.stringify(steamConfigContent, null, 2)
        );
        
        // Create Steam README
        const steamReadme = `# Chaos World - Steam Build

This is the Steam build of Chaos World.

## Files
- index.html: Main game file
- Build/: Unity WebGL build files
- steam-config.json: Steam configuration
- steam_appid.txt: Steam App ID

## Deployment
1. Upload to Steam using Steamworks SDK
2. Configure Steam features in steam-config.json
3. Test Steam integration

## Steam Features
- Achievements: ${steamConfig.achievements.length} achievements configured
- Cloud Saves: ${steamConfig.cloudSaves.enabled ? 'Enabled' : 'Disabled'}
- Friends: ${steamConfig.friends.enabled ? 'Enabled' : 'Disabled'}
- Overlay: ${steamConfig.webgl.enableSteamOverlay ? 'Enabled' : 'Disabled'}
`;
        
        fs.writeFileSync(
            path.join(steamBuildPath, 'README.md'),
            steamReadme
        );
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
}

// Run deployment if called directly
if (require.main === module) {
    const deployer = new GameDeployer();
    deployer.deploy().catch(console.error);
}

module.exports = GameDeployer;
