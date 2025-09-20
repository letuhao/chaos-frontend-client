# Quick Start Guide

## 🚀 **Get Started in 30 Minutes**

This guide will help you set up the Chaos World game project and get it running quickly.

## 📋 **Prerequisites**

### **Required Software**
- **Unity 2023.3 LTS** - [Download here](https://unity.com/download)
- **Git** - [Download here](https://git-scm.com/downloads)
- **Code Editor** - Visual Studio Code or Visual Studio 2022

### **System Requirements**
- **Windows 10/11** or **macOS 10.15+** or **Linux Ubuntu 18.04+**
- **8GB RAM** minimum (16GB recommended)
- **2GB free disk space**
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

## ⚡ **Quick Setup**

### **Step 1: Clone Repository**
```bash
git clone <repository-url>
cd chaos-frontend-client
```

### **Step 2: Open Unity Project**
1. **Open Unity Hub**
2. **Click "Add"**
3. **Select the `unity-project` folder**
4. **Click "Open"**

### **Step 3: Configure WebGL Build**
1. **File → Build Settings**
2. **Select "WebGL" platform**
3. **Click "Switch Platform"** (if needed)
4. **Click "Player Settings"**
5. **Configure settings:**
   - **Company Name:** Your Studio Name
   - **Product Name:** Chaos World
   - **Version:** 0.1.0

### **Step 4: Build and Test**
1. **File → Build Settings**
2. **Click "Build"**
3. **Select build folder:** `../builds/webgl`
4. **Wait for build to complete**
5. **Open `builds/webgl/index.html`** in browser

## 🎮 **First Game Features**

### **Basic Character System**
```csharp
// Create a new C# script: PlayerController.cs
using UnityEngine;

public class PlayerController : MonoBehaviour
{
    [Header("Player Stats")]
    public int level = 1;
    public int health = 100;
    public int mana = 50;
    public int experience = 0;
    
    [Header("Movement")]
    public float moveSpeed = 5f;
    
    private Rigidbody2D rb;
    
    void Start()
    {
        rb = GetComponent<Rigidbody2D>();
    }
    
    void Update()
    {
        HandleMovement();
    }
    
    void HandleMovement()
    {
        float horizontal = Input.GetAxis("Horizontal");
        float vertical = Input.GetAxis("Vertical");
        
        Vector2 movement = new Vector2(horizontal, vertical);
        rb.velocity = movement * moveSpeed;
    }
}
```

### **Basic UI System**
```csharp
// Create a new C# script: UIManager.cs
using UnityEngine;
using UnityEngine.UI;

public class UIManager : MonoBehaviour
{
    [Header("UI Elements")]
    public Text healthText;
    public Text manaText;
    public Text levelText;
    public Text experienceText;
    
    [Header("Player Reference")]
    public PlayerController player;
    
    void Update()
    {
        UpdateUI();
    }
    
    void UpdateUI()
    {
        if (player != null)
        {
            healthText.text = $"Health: {player.health}";
            manaText.text = $"Mana: {player.mana}";
            levelText.text = $"Level: {player.level}";
            experienceText.text = $"XP: {player.experience}";
        }
    }
}
```

### **Basic Cultivation System**
```csharp
// Create a new C# script: CultivationSystem.cs
using UnityEngine;

public class CultivationSystem : MonoBehaviour
{
    [Header("Cultivation Stats")]
    public int cultivationLevel = 1;
    public float cultivationProgress = 0f;
    public float cultivationSpeed = 1f;
    
    [Header("Realm Names")]
    public string[] realmNames = {
        "Qi Refining", "Foundation Building", "Core Formation",
        "Nascent Soul", "Spirit Transformation", "Body Refining",
        "Soul Refining", "Immortal"
    };
    
    public void Cultivate(float timeSpent)
    {
        cultivationProgress += timeSpent * cultivationSpeed;
        
        if (cultivationProgress >= 100f)
        {
            Breakthrough();
        }
    }
    
    void Breakthrough()
    {
        cultivationLevel++;
        cultivationProgress = 0f;
        cultivationSpeed += 0.1f;
        
        Debug.Log($"Breakthrough! Now at {realmNames[cultivationLevel - 1]}");
    }
}
```

## 🎯 **First Scene Setup**

### **1. Create Main Scene**
1. **File → New Scene**
2. **Save as:** `MainScene`
3. **Add to Build Settings**

### **2. Create Player Object**
1. **GameObject → 2D Object → Sprite**
2. **Name:** "Player"
3. **Add Components:**
   - `Rigidbody2D`
   - `Collider2D`
   - `PlayerController` script

### **3. Create UI Canvas**
1. **GameObject → UI → Canvas**
2. **Name:** "UI Canvas"
3. **Add UI Elements:**
   - **Text** for health display
   - **Text** for mana display
   - **Text** for level display
   - **Button** for cultivation

### **4. Setup Camera**
1. **Select Main Camera**
2. **Set Projection:** Orthographic
3. **Set Size:** 5
4. **Position:** (0, 0, -10)

## 🔧 **Quick Testing**

### **Desktop Testing**
1. **Press Play** in Unity
2. **Use WASD** to move player
3. **Check UI** updates correctly
4. **Test cultivation** button

### **WebGL Testing**
1. **Build WebGL** version
2. **Open in browser**
3. **Test on different browsers**
4. **Check mobile compatibility**

## 📱 **Mobile Optimization Quick Tips**

### **1. Touch Controls**
```csharp
// Add to PlayerController.cs
public class PlayerController : MonoBehaviour
{
    [Header("Touch Controls")]
    public bool useTouchControls = true;
    
    void Update()
    {
        if (useTouchControls && Input.touchCount > 0)
        {
            HandleTouchInput();
        }
        else
        {
            HandleKeyboardInput();
        }
    }
    
    void HandleTouchInput()
    {
        Touch touch = Input.GetTouch(0);
        Vector2 touchPosition = Camera.main.ScreenToWorldPoint(touch.position);
        Vector2 direction = (touchPosition - (Vector2)transform.position).normalized;
        
        rb.velocity = direction * moveSpeed;
    }
    
    void HandleKeyboardInput()
    {
        float horizontal = Input.GetAxis("Horizontal");
        float vertical = Input.GetAxis("Vertical");
        
        Vector2 movement = new Vector2(horizontal, vertical);
        rb.velocity = movement * moveSpeed;
    }
}
```

### **2. UI Scaling**
```csharp
// Add to UIManager.cs
public class UIManager : MonoBehaviour
{
    [Header("Mobile UI")]
    public CanvasScaler canvasScaler;
    
    void Start()
    {
        SetupMobileUI();
    }
    
    void SetupMobileUI()
    {
        if (Screen.width <= 768) // Mobile
        {
            canvasScaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            canvasScaler.referenceResolution = new Vector2(1920, 1080);
            canvasScaler.matchWidthOrHeight = 0.5f;
        }
    }
}
```

## 🎮 **Steam Integration Quick Setup**

### **1. Steam Web API Setup**
```csharp
// Create SteamWebAPI.cs
using UnityEngine;
using System.Collections;

public class SteamWebAPI : MonoBehaviour
{
    [Header("Steam Configuration")]
    public string steamWebAPIKey = "YOUR_API_KEY";
    public string steamAppID = "YOUR_APP_ID";
    
    public void InitializeSteam()
    {
        Debug.Log("Steam Web API initialized");
        // Add Steam integration code here
    }
}
```

### **2. Steam Achievements**
```csharp
// Add to PlayerController.cs
public class PlayerController : MonoBehaviour
{
    [Header("Steam Integration")]
    public SteamWebAPI steamAPI;
    
    void Breakthrough()
    {
        cultivationLevel++;
        cultivationProgress = 0f;
        cultivationSpeed += 0.1f;
        
        Debug.Log($"Breakthrough! Now at {realmNames[cultivationLevel - 1]}");
        
        // Unlock Steam achievement
        if (steamAPI != null)
        {
            steamAPI.UnlockAchievement("first_breakthrough");
        }
    }
}
```

## 🚀 **Deployment Quick Start**

### **1. Netlify Deployment**
1. **Build WebGL** project
2. **Go to [Netlify](https://netlify.com)**
3. **Drag and drop** `builds/webgl` folder
4. **Get your URL** and test

### **2. GitHub Pages Deployment**
1. **Push code** to GitHub
2. **Go to repository settings**
3. **Enable GitHub Pages**
4. **Select source:** `builds/webgl` folder
5. **Get your URL** and test

## 🔍 **Troubleshooting**

### **Common Issues**

#### **Build Fails**
- **Check WebGL module** is installed
- **Verify project settings**
- **Check for compilation errors**

#### **Game Doesn't Load**
- **Check browser console** for errors
- **Verify file paths** are correct
- **Test on different browsers**

#### **Mobile Performance Issues**
- **Reduce texture sizes**
- **Limit particle effects**
- **Use object pooling**

### **Debug Tools**
- **Unity Profiler:** Window → Analysis → Profiler
- **Browser Console:** F12 → Console tab
- **Mobile Testing:** Use browser dev tools

## 📚 **Next Steps**

### **Immediate Next Steps**
1. **Read [Game Architecture](game-architecture.md)** for detailed system design
2. **Follow [Mobile Optimization](mobile-optimization.md)** for performance tips
3. **Set up [Steam Integration](steam-integration.md)** for Steam features
4. **Configure [Deployment](deployment.md)** for hosting

### **Development Roadmap**
1. **Week 1:** Basic character and movement
2. **Week 2:** Cultivation system
3. **Week 3:** Combat system
4. **Week 4:** UI and polish
5. **Week 5:** Mobile optimization
6. **Week 6:** Steam integration
7. **Week 7:** Testing and deployment
8. **Week 8:** Launch preparation

## 🎯 **Success Metrics**

### **Technical Goals**
- **60 FPS** on desktop
- **30 FPS** on mobile
- **< 5 second** load time
- **< 50MB** build size

### **Gameplay Goals**
- **Smooth movement** and controls
- **Responsive UI** on all devices
- **Steam integration** working
- **Save system** functional

---

**Ready to start?** Follow the [Setup Guide](setup-guide.md) for detailed instructions!

**Need help?** Check the [Game Architecture](game-architecture.md) for system design guidance.
