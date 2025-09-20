# Deployment Guide

## 🚀 **WebGL Deployment Strategy**

### **Deployment Options Overview**
- **Web Hosting** - Traditional web hosting
- **CDN** - Content Delivery Network for global distribution
- **Steam Integration** - Steam store page with WebGL
- **PWA** - Progressive Web App for mobile
- **Cloud Platforms** - AWS, Azure, Google Cloud

## 🌐 **Web Hosting Setup**

### **1. Traditional Web Hosting**

#### **Hosting Requirements**
```
Minimum Requirements:
- 1GB Storage
- 10GB Bandwidth
- HTTPS Support
- Gzip Compression
- Browser Caching
```

#### **Recommended Hosts**
- **Netlify** - Free tier, easy deployment
- **Vercel** - Great for static sites
- **GitHub Pages** - Free hosting
- **AWS S3** - Scalable and reliable
- **Azure Static Web Apps** - Microsoft's solution

### **2. Netlify Deployment**

#### **Netlify Configuration**
```toml
# netlify.toml
[build]
  publish = "builds/webgl"
  command = "echo 'No build command needed'"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "*.wasm"
  [headers.values]
    Content-Type = "application/wasm"

[[headers]]
  for = "*.data"
  [headers.values]
    Content-Type = "application/octet-stream"

[[headers]]
  for = "*.symbols.json"
  [headers.values]
    Content-Type = "application/json"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### **Deployment Script**
```bash
#!/bin/bash
# deploy.sh

echo "🚀 Deploying Chaos World to Netlify..."

# Build Unity WebGL
echo "📦 Building Unity WebGL..."
/Applications/Unity/Hub/Editor/2023.3.0f1/Unity.app/Contents/MacOS/Unity \
  -batchmode \
  -quit \
  -projectPath "unity-project" \
  -buildTarget WebGL \
  -executeMethod BuildScript.BuildWebGL

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
netlify deploy --prod --dir=builds/webgl

echo "✅ Deployment complete!"
```

### **3. AWS S3 Deployment**

#### **S3 Configuration**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::chaos-world-game/*"
    }
  ]
}
```

#### **CloudFront Distribution**
```yaml
# cloudfront.yml
Distribution:
  DistributionConfig:
    Origins:
      - Id: S3-Origin
        DomainName: chaos-world-game.s3.amazonaws.com
        S3OriginConfig:
          OriginAccessIdentity: ""
    DefaultCacheBehavior:
      TargetOriginId: S3-Origin
      ViewerProtocolPolicy: redirect-to-https
      Compress: true
      CachePolicyId: 4135ea2d-6df8-44a3-9df3-4b5a84be39ad
    Enabled: true
    Comment: "Chaos World Game Distribution"
    DefaultRootObject: "index.html"
    CustomErrorResponses:
      - ErrorCode: 404
        ResponseCode: 200
        ResponsePagePath: "/index.html"
```

## 📱 **Progressive Web App (PWA) Setup**

### **1. PWA Manifest**
```json
{
  "name": "Chaos World",
  "short_name": "ChaosWorld",
  "description": "A cultivation RPG inspired by Tale of Immortal",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#1a1a1a",
  "orientation": "landscape",
  "icons": [
    {
      "src": "icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "categories": ["games", "entertainment"],
  "lang": "en",
  "dir": "ltr"
}
```

### **2. Service Worker**
```javascript
// sw.js
const CACHE_NAME = 'chaos-world-v1';
const urlsToCache = [
  '/',
  '/index.html',
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
```

### **3. PWA Integration Script**
```csharp
// PWAIntegration.cs
public class PWAIntegration : MonoBehaviour
{
    [Header("PWA Settings")]
    public bool enablePWA = true;
    public string manifestURL = "manifest.json";
    
    private void Start()
    {
        if (enablePWA)
        {
            SetupPWA();
        }
    }
    
    private void SetupPWA()
    {
        // Inject PWA scripts
        InjectPWAScripts();
        
        // Setup service worker
        SetupServiceWorker();
        
        // Handle install prompt
        SetupInstallPrompt();
    }
    
    private void InjectPWAScripts()
    {
        // Inject manifest link
        string manifestScript = @"
            var link = document.createElement('link');
            link.rel = 'manifest';
            link.href = 'manifest.json';
            document.head.appendChild(link);
        ";
        
        Application.ExternalEval(manifestScript);
    }
    
    private void SetupServiceWorker()
    {
        string serviceWorkerScript = @"
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => console.log('SW registered'))
                    .catch(error => console.log('SW registration failed'));
            }
        ";
        
        Application.ExternalEval(serviceWorkerScript);
    }
    
    private void SetupInstallPrompt()
    {
        string installPromptScript = @"
            let deferredPrompt;
            window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                // Show install button
            });
        ";
        
        Application.ExternalEval(installPromptScript);
    }
}
```

## 🎮 **Steam Integration Deployment**

### **1. Steam Store Page Setup**

#### **Store Page Configuration**
```json
{
  "appid": "YOUR_STEAM_APP_ID",
  "name": "Chaos World",
  "type": "game",
  "description": "A cultivation RPG inspired by Tale of Immortal",
  "short_description": "Cultivate your way to immortality",
  "website": "https://chaos-world-game.com",
  "header_image": "https://chaos-world-game.com/header.jpg",
  "capsule_image": "https://chaos-world-game.com/capsule.jpg",
  "background": "https://chaos-world-game.com/background.jpg",
  "categories": ["RPG", "Indie", "Free to Play"],
  "genres": ["RPG", "Indie"],
  "platforms": {
    "windows": true,
    "mac": true,
    "linux": true
  },
  "webgl_url": "https://chaos-world-game.com",
  "release_date": "2025-12-31"
}
```

#### **Steam Web API Integration**
```csharp
// SteamWebAPIConfig.cs
public class SteamWebAPIConfig : ScriptableObject
{
    [Header("Steam Configuration")]
    public string steamAppID = "YOUR_STEAM_APP_ID";
    public string steamWebAPIKey = "YOUR_STEAM_WEB_API_KEY";
    public string steamCommunityURL = "https://steamcommunity.com";
    public string steamStoreURL = "https://store.steampowered.com";
    
    [Header("Game Configuration")]
    public string gameName = "Chaos World";
    public string gameVersion = "1.0.0";
    public string gameDescription = "A cultivation RPG inspired by Tale of Immortal";
    
    [Header("WebGL Configuration")]
    public string webGLURL = "https://chaos-world-game.com";
    public string webGLBuildPath = "/Build";
    public string webGLDataPath = "/Build/chaos-world.data";
    public string webGLWasmPath = "/Build/chaos-world.wasm";
    public string webGLFrameworkPath = "/Build/chaos-world.framework.js";
}
```

### **2. Steam Achievements Setup**

#### **Achievement Configuration**
```json
{
  "achievements": [
    {
      "id": "first_cultivation",
      "name": "First Steps",
      "description": "Begin your cultivation journey",
      "icon": "achievement_first_cultivation.png",
      "hidden": false
    },
    {
      "id": "realm_breakthrough",
      "name": "Realm Breaker",
      "description": "Break through to a new cultivation realm",
      "icon": "achievement_realm_breakthrough.png",
      "hidden": false
    },
    {
      "id": "immortal_ascension",
      "name": "Immortal Ascension",
      "description": "Reach the highest cultivation realm",
      "icon": "achievement_immortal_ascension.png",
      "hidden": true
    }
  ]
}
```

## 🔧 **Build Automation**

### **1. Unity Build Script**
```csharp
// BuildScript.cs
public class BuildScript
{
    [MenuItem("Build/Build WebGL")]
    public static void BuildWebGL()
    {
        BuildPlayerOptions buildPlayerOptions = new BuildPlayerOptions();
        buildPlayerOptions.scenes = GetScenes();
        buildPlayerOptions.locationPathName = "../builds/webgl";
        buildPlayerOptions.target = BuildTarget.WebGL;
        buildPlayerOptions.options = BuildOptions.None;
        
        // Configure WebGL settings
        PlayerSettings.WebGL.compressionFormat = WebGLCompressionFormat.Gzip;
        PlayerSettings.WebGL.dataCaching = true;
        PlayerSettings.WebGL.exceptionSupport = WebGLExceptionSupport.Full;
        
        BuildPipeline.BuildPlayer(buildPlayerOptions);
    }
    
    private static string[] GetScenes()
    {
        List<string> scenes = new List<string>();
        for (int i = 0; i < EditorBuildSettings.scenes.Length; i++)
        {
            if (EditorBuildSettings.scenes[i].enabled)
            {
                scenes.Add(EditorBuildSettings.scenes[i].path);
            }
        }
        return scenes.ToArray();
    }
}
```

### **2. GitHub Actions Workflow**
```yaml
# .github/workflows/deploy.yml
name: Deploy Chaos World

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Unity
      uses: game-ci/unity-setup@v2
      with:
        unity-version: 2023.3.0f1
        
    - name: Build Unity WebGL
      uses: game-ci/unity-builder@v2
      with:
        targetPlatform: WebGL
        buildName: ChaosWorld
        buildPath: builds/webgl
        
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: './builds/webgl'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### **3. Docker Configuration**
```dockerfile
# Dockerfile
FROM nginx:alpine

# Copy WebGL build
COPY builds/webgl /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        application/wasm;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        # WebGL specific headers
        location ~* \.(wasm|data|symbols\.json)$ {
            add_header Content-Type application/octet-stream;
            add_header Cache-Control "public, max-age=31536000";
        }
        
        # SPA routing
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

## 📊 **Analytics and Monitoring**

### **1. Google Analytics Integration**
```csharp
// AnalyticsManager.cs
public class AnalyticsManager : MonoBehaviour
{
    [Header("Analytics")]
    public string googleAnalyticsID = "GA_MEASUREMENT_ID";
    public bool enableAnalytics = true;
    
    private void Start()
    {
        if (enableAnalytics)
        {
            InitializeAnalytics();
        }
    }
    
    private void InitializeAnalytics()
    {
        string analyticsScript = $@"
            (function(i,s,o,g,r,a,m){{i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){{
            (i[r].q=i[r].q||[]).push(arguments)}},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            }})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
            
            ga('create', '{googleAnalyticsID}', 'auto');
            ga('send', 'pageview');
        ";
        
        Application.ExternalEval(analyticsScript);
    }
    
    public void TrackEvent(string eventName, string eventCategory, string eventAction)
    {
        if (enableAnalytics)
        {
            string eventScript = $@"
                ga('send', 'event', '{eventCategory}', '{eventAction}', '{eventName}');
            ";
            
            Application.ExternalEval(eventScript);
        }
    }
}
```

### **2. Performance Monitoring**
```csharp
// PerformanceMonitor.cs
public class PerformanceMonitor : MonoBehaviour
{
    [Header("Performance Monitoring")]
    public bool enableMonitoring = true;
    public float monitoringInterval = 5f;
    
    private void Start()
    {
        if (enableMonitoring)
        {
            InvokeRepeating(nameof(MonitorPerformance), 0f, monitoringInterval);
        }
    }
    
    private void MonitorPerformance()
    {
        float fps = 1f / Time.deltaTime;
        float memoryUsage = (float)System.GC.GetTotalMemory(false) / (1024 * 1024);
        
        // Send performance data to analytics
        AnalyticsManager.Instance.TrackEvent("performance", "fps", fps.ToString());
        AnalyticsManager.Instance.TrackEvent("performance", "memory", memoryUsage.ToString());
    }
}
```

## 🔒 **Security Considerations**

### **1. HTTPS Configuration**
```csharp
// SecurityManager.cs
public class SecurityManager : MonoBehaviour
{
    [Header("Security")]
    public bool enforceHTTPS = true;
    public bool enableCSP = true;
    
    private void Start()
    {
        if (enforceHTTPS)
        {
            CheckHTTPS();
        }
        
        if (enableCSP)
        {
            SetupCSP();
        }
    }
    
    private void CheckHTTPS()
    {
        string httpsCheckScript = @"
            if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
                location.replace('https:' + window.location.href.substring(window.location.protocol.length));
            }
        ";
        
        Application.ExternalEval(httpsCheckScript);
    }
    
    private void SetupCSP()
    {
        string cspScript = @"
            var meta = document.createElement('meta');
            meta.httpEquiv = 'Content-Security-Policy';
            meta.content = 'default-src self; script-src self unsafe-eval; style-src self unsafe-inline;';
            document.head.appendChild(meta);
        ";
        
        Application.ExternalEval(cspScript);
    }
}
```

### **2. Input Validation**
```csharp
// InputValidator.cs
public class InputValidator : MonoBehaviour
{
    public static bool ValidateSteamID(string steamID)
    {
        // Steam ID validation
        return System.Text.RegularExpressions.Regex.IsMatch(steamID, @"^7656119[0-9]{10}$");
    }
    
    public static bool ValidateAchievementID(string achievementID)
    {
        // Achievement ID validation
        return System.Text.RegularExpressions.Regex.IsMatch(achievementID, @"^[a-zA-Z0-9_]+$");
    }
    
    public static string SanitizeInput(string input)
    {
        // Sanitize user input
        return input.Replace("<", "&lt;").Replace(">", "&gt;").Replace("\"", "&quot;");
    }
}
```

## 🚀 **Deployment Checklist**

### **Pre-Deployment**
- [ ] Unity WebGL build successful
- [ ] All assets optimized for mobile
- [ ] Performance testing completed
- [ ] Security measures implemented
- [ ] Analytics configured
- [ ] Steam integration tested

### **Deployment**
- [ ] Web hosting configured
- [ ] CDN setup (if using)
- [ ] PWA manifest created
- [ ] Service worker implemented
- [ ] Steam store page created
- [ ] Analytics tracking active

### **Post-Deployment**
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Performance monitoring
- [ ] User feedback collection
- [ ] Bug tracking setup
- [ ] Update mechanism ready

---

**Next:** [Game Architecture Guide](game-architecture.md)
