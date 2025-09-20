# Unity WebGL Setup Guide

## 🚀 **Project Setup**

### **Prerequisites**
- Unity 2023.3 LTS or newer
- Visual Studio 2022 or VS Code
- Git for version control
- Web browser for testing

### **1. Unity Installation**

#### **Download Unity Hub**
1. Go to [Unity Download](https://unity.com/download)
2. Download Unity Hub
3. Install Unity Hub

#### **Install Unity Editor**
1. Open Unity Hub
2. Go to "Installs" tab
3. Click "Install Editor"
4. Select **Unity 2023.3 LTS**
5. Add modules:
   - ✅ **WebGL Build Support**
   - ✅ **Windows Build Support** (for future Steam)
   - ✅ **Mac Build Support** (for future Steam)
   - ✅ **Linux Build Support** (for future Steam)

### **2. Project Creation**

#### **Create New Project**
1. Open Unity Hub
2. Click "New Project"
3. Select **2D Template** (for cultivation RPG)
4. Project name: `ChaosWorldGame`
5. Location: `chaos-frontend-client/unity-project`
6. Click "Create Project"

#### **Configure Project Settings**
1. **File → Build Settings**
2. **Platform:** WebGL
3. **Player Settings:**
   - **Company Name:** Your Studio Name
   - **Product Name:** Chaos World
   - **Version:** 0.1.0
   - **WebGL Template:** Default

### **3. WebGL Configuration**

#### **WebGL Player Settings**
1. **File → Build Settings → Player Settings**
2. **WebGL Settings:**
   - **Compression Format:** Gzip
   - **Data Caching:** Enabled
   - **Exception Support:** Full
   - **Code Stripping Level:** Minimal
   - **Managed Stripping Level:** Minimal

#### **Publishing Settings**
1. **Publishing Settings:**
   - **Compression Format:** Gzip
   - **Data Caching:** Enabled
   - **Name Files As Hashes:** Enabled
   - **Decompression Fallback:** Enabled

### **4. Mobile Optimization Settings**

#### **Graphics Settings**
1. **Edit → Project Settings → Graphics**
2. **Scriptable Render Pipeline:** URP (Universal Render Pipeline)
3. **Color Space:** Linear
4. **Quality Settings:**
   - **Texture Quality:** Half Res
   - **Anisotropic Textures:** Disabled
   - **Anti Aliasing:** Disabled
   - **Soft Particles:** Disabled

#### **Quality Settings**
1. **Edit → Project Settings → Quality**
2. **WebGL Quality:**
   - **Pixel Light Count:** 1
   - **Texture Quality:** Half Res
   - **Anisotropic Textures:** Disabled
   - **Anti Aliasing:** Disabled
   - **Soft Particles:** Disabled
   - **Realtime Reflection Probes:** Disabled

### **5. Build Configuration**

#### **WebGL Build Settings**
1. **File → Build Settings**
2. **Platform:** WebGL
3. **Scenes to Build:**
   - Add your main scene
4. **Build Settings:**
   - **Development Build:** Checked (for debugging)
   - **Script Debugging:** Checked (for debugging)
   - **Autoconnect Profiler:** Checked (for debugging)

#### **Build Process**
1. **File → Build Settings**
2. **Platform:** WebGL
3. **Build Folder:** `../builds/webgl`
4. **Click "Build"**
5. **Wait for build to complete**

### **6. Testing Setup**

#### **Local Testing**
1. **Build the project**
2. **Open `builds/webgl/index.html`** in browser
3. **Test on different browsers:**
   - Chrome
   - Firefox
   - Safari
   - Edge

#### **Mobile Testing**
1. **Host the build on local server**
2. **Access from mobile device**
3. **Test performance and controls**

### **7. Development Workflow**

#### **Daily Development**
1. **Make changes in Unity**
2. **Test in Play mode**
3. **Build WebGL version**
4. **Test in browser**
5. **Commit changes to Git**

#### **Version Control**
```bash
# Initialize Git repository
git init
git add .
git commit -m "Initial Unity project setup"

# Create .gitignore
echo "Library/
Temp/
Obj/
Build/
Builds/
UserSettings/
*.tmp
*.user
*.userprefs
*.pidb
*.booproj
*.svd
*.pdb
*.mdb
*.opendb
*.VC.db
*.VC.VC.opendb" > .gitignore
```

### **8. Performance Optimization**

#### **WebGL Specific Optimizations**
1. **Texture Compression:**
   - Use DXT1 for opaque textures
   - Use DXT5 for transparent textures
   - Compress textures to reduce file size

2. **Audio Optimization:**
   - Use compressed audio formats
   - Limit audio channels
   - Use audio pooling

3. **Script Optimization:**
   - Avoid `Update()` methods
   - Use object pooling
   - Cache frequently used components

#### **Mobile Performance**
1. **Reduce draw calls**
2. **Use sprite atlases**
3. **Limit particle effects**
4. **Optimize UI elements**

### **9. Troubleshooting**

#### **Common Issues**
1. **Build fails:**
   - Check WebGL module is installed
   - Verify project settings
   - Check for compilation errors

2. **Performance issues:**
   - Enable WebGL profiler
   - Check memory usage
   - Optimize textures and scripts

3. **Mobile issues:**
   - Test on actual devices
   - Check touch input
   - Verify performance

#### **Debug Tools**
1. **Unity Profiler:** Window → Analysis → Profiler
2. **WebGL Profiler:** Browser developer tools
3. **Console Logs:** Browser console

### **10. Next Steps**

After setup completion:
1. **Read [Game Architecture](game-architecture.md)**
2. **Follow [Mobile Optimization](mobile-optimization.md)**
3. **Set up [Steam Integration](steam-integration.md)**
4. **Start development!**

---

**Next:** [Game Architecture Guide](game-architecture.md)
