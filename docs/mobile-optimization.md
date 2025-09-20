# Mobile Optimization Guide

## 📱 **Mobile Performance Strategy**

### **Why Mobile Optimization Matters**
- **WebGL Performance** - Mobile browsers have limited resources
- **Touch Controls** - Different input method than desktop
- **Battery Life** - Optimize for longer play sessions
- **Screen Sizes** - Responsive UI for different devices

## ⚡ **Performance Optimization**

### **1. Graphics Optimization**

#### **Texture Settings**
```csharp
// Texture Import Settings
public class TextureOptimizer : MonoBehaviour
{
    [Header("Mobile Texture Settings")]
    public int maxTextureSize = 512;
    public TextureImporterFormat textureFormat = TextureImporterFormat.DXT1;
    public TextureImporterCompression compressionQuality = TextureImporterCompression.Normal;
    
    [ContextMenu("Optimize Textures")]
    public void OptimizeTextures()
    {
        // Set texture import settings for mobile
        TextureImporter importer = (TextureImporter)AssetImporter.GetAtPath(assetPath);
        importer.maxTextureSize = maxTextureSize;
        importer.textureFormat = textureFormat;
        importer.compressionQuality = compressionQuality;
        importer.SaveAndReimport();
    }
}
```

#### **Sprite Atlas Optimization**
```csharp
// Sprite Atlas Settings
[CreateAssetMenu(fileName = "MobileSpriteAtlas", menuName = "Game/Atlases/Mobile")]
public class MobileSpriteAtlas : ScriptableObject
{
    [Header("Atlas Settings")]
    public int atlasSize = 1024;
    public SpritePackingMode packingMode = SpritePackingMode.Tight;
    public SpritePackingRotation rotation = SpritePackingRotation.None;
    
    [Header("Mobile Optimization")]
    public bool enableRotation = false;
    public bool enableTightPacking = true;
    public bool enableAlphaDilation = false;
}
```

### **2. Rendering Optimization**

#### **Camera Settings**
```csharp
public class MobileCamera : MonoBehaviour
{
    [Header("Mobile Camera Settings")]
    public float fieldOfView = 60f;
    public float nearClipPlane = 0.1f;
    public float farClipPlane = 1000f;
    
    [Header("Performance")]
    public bool enableHDR = false;
    public bool enableMSAA = false;
    public bool enableOcclusionCulling = true;
    
    private void Start()
    {
        Camera cam = GetComponent<Camera>();
        
        // Mobile-optimized camera settings
        cam.fieldOfView = fieldOfView;
        cam.nearClipPlane = nearClipPlane;
        cam.farClipPlane = farClipPlane;
        cam.allowHDR = enableHDR;
        cam.allowMSAA = enableMSAA;
        cam.useOcclusionCulling = enableOcclusionCulling;
    }
}
```

#### **LOD System**
```csharp
public class MobileLOD : MonoBehaviour
{
    [Header("LOD Settings")]
    public float[] lodDistances = { 10f, 20f, 50f };
    public GameObject[] lodLevels;
    
    private Transform player;
    private int currentLOD = 0;
    
    private void Start()
    {
        player = GameManager.Instance.Player.transform;
    }
    
    private void Update()
    {
        float distance = Vector3.Distance(transform.position, player.position);
        int newLOD = GetLODLevel(distance);
        
        if (newLOD != currentLOD)
        {
            SetLODLevel(newLOD);
        }
    }
    
    private int GetLODLevel(float distance)
    {
        for (int i = 0; i < lodDistances.Length; i++)
        {
            if (distance <= lodDistances[i])
                return i;
        }
        return lodDistances.Length;
    }
}
```

### **3. UI Optimization**

#### **Mobile UI Layout**
```csharp
public class MobileUI : MonoBehaviour
{
    [Header("Mobile UI Settings")]
    public CanvasScaler canvasScaler;
    public RectTransform safeArea;
    
    [Header("Touch Controls")]
    public Button[] touchButtons;
    public float buttonSize = 80f;
    public float buttonSpacing = 10f;
    
    private void Start()
    {
        SetupMobileUI();
        SetupTouchControls();
    }
    
    private void SetupMobileUI()
    {
        // Set canvas scaler for mobile
        canvasScaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
        canvasScaler.referenceResolution = new Vector2(1920, 1080);
        canvasScaler.screenMatchMode = CanvasScaler.ScreenMatchMode.MatchWidthOrHeight;
        canvasScaler.matchWidthOrHeight = 0.5f;
        
        // Setup safe area for notched devices
        SetupSafeArea();
    }
    
    private void SetupSafeArea()
    {
        Rect safeAreaRect = Screen.safeArea;
        safeArea.anchorMin = safeAreaRect.position;
        safeArea.anchorMax = safeAreaRect.position + safeAreaRect.size;
    }
}
```

#### **Touch Input System**
```csharp
public class TouchInput : MonoBehaviour
{
    [Header("Touch Settings")]
    public float touchSensitivity = 1f;
    public float doubleTapTime = 0.3f;
    
    private Vector2 lastTouchPosition;
    private float lastTapTime;
    private int tapCount;
    
    private void Update()
    {
        if (Input.touchCount > 0)
        {
            Touch touch = Input.GetTouch(0);
            HandleTouch(touch);
        }
    }
    
    private void HandleTouch(Touch touch)
    {
        switch (touch.phase)
        {
            case TouchPhase.Began:
                OnTouchStart(touch.position);
                break;
            case TouchPhase.Moved:
                OnTouchMove(touch.position);
                break;
            case TouchPhase.Ended:
                OnTouchEnd(touch.position);
                break;
        }
    }
    
    private void OnTouchStart(Vector2 position)
    {
        lastTouchPosition = position;
        // Handle touch start
    }
    
    private void OnTouchMove(Vector2 position)
    {
        Vector2 delta = position - lastTouchPosition;
        // Handle touch movement
        lastTouchPosition = position;
    }
    
    private void OnTouchEnd(Vector2 position)
    {
        // Handle touch end
        CheckDoubleTap();
    }
    
    private void CheckDoubleTap()
    {
        float currentTime = Time.time;
        if (currentTime - lastTapTime < doubleTapTime)
        {
            tapCount++;
            if (tapCount == 2)
            {
                OnDoubleTap();
                tapCount = 0;
            }
        }
        else
        {
            tapCount = 1;
        }
        lastTapTime = currentTime;
    }
}
```

### **4. Memory Management**

#### **Object Pooling**
```csharp
public class MobileObjectPool : MonoBehaviour
{
    [Header("Pool Settings")]
    public GameObject prefab;
    public int poolSize = 50;
    public bool expandPool = true;
    
    private Queue<GameObject> pool;
    private List<GameObject> activeObjects;
    
    private void Start()
    {
        InitializePool();
    }
    
    private void InitializePool()
    {
        pool = new Queue<GameObject>();
        activeObjects = new List<GameObject>();
        
        for (int i = 0; i < poolSize; i++)
        {
            GameObject obj = Instantiate(prefab);
            obj.SetActive(false);
            pool.Enqueue(obj);
        }
    }
    
    public GameObject GetObject()
    {
        GameObject obj;
        
        if (pool.Count > 0)
        {
            obj = pool.Dequeue();
        }
        else if (expandPool)
        {
            obj = Instantiate(prefab);
        }
        else
        {
            return null;
        }
        
        obj.SetActive(true);
        activeObjects.Add(obj);
        return obj;
    }
    
    public void ReturnObject(GameObject obj)
    {
        if (activeObjects.Contains(obj))
        {
            activeObjects.Remove(obj);
            obj.SetActive(false);
            pool.Enqueue(obj);
        }
    }
}
```

#### **Memory Monitoring**
```csharp
public class MemoryMonitor : MonoBehaviour
{
    [Header("Memory Settings")]
    public float memoryCheckInterval = 5f;
    public float memoryThreshold = 0.8f;
    
    private void Start()
    {
        InvokeRepeating(nameof(CheckMemoryUsage), memoryCheckInterval, memoryCheckInterval);
    }
    
    private void CheckMemoryUsage()
    {
        float memoryUsage = (float)System.GC.GetTotalMemory(false) / (1024 * 1024); // MB
        float memoryLimit = SystemInfo.systemMemorySize * 0.8f; // 80% of system memory
        
        if (memoryUsage > memoryLimit)
        {
            Debug.LogWarning($"Memory usage high: {memoryUsage:F2}MB / {memoryLimit:F2}MB");
            TriggerMemoryCleanup();
        }
    }
    
    private void TriggerMemoryCleanup()
    {
        // Force garbage collection
        System.GC.Collect();
        
        // Clear unused assets
        Resources.UnloadUnusedAssets();
        
        // Clear object pools if needed
        // ObjectPoolManager.Instance.ClearUnusedObjects();
    }
}
```

### **5. Performance Profiling**

#### **Mobile Profiler**
```csharp
public class MobileProfiler : MonoBehaviour
{
    [Header("Profiler Settings")]
    public bool enableProfiling = true;
    public float profileInterval = 1f;
    
    [Header("Performance Metrics")]
    public float fps;
    public float memoryUsage;
    public int drawCalls;
    public int triangles;
    
    private void Start()
    {
        if (enableProfiling)
        {
            InvokeRepeating(nameof(UpdateMetrics), 0f, profileInterval);
        }
    }
    
    private void UpdateMetrics()
    {
        fps = 1f / Time.deltaTime;
        memoryUsage = (float)System.GC.GetTotalMemory(false) / (1024 * 1024);
        
        // Get rendering stats
        drawCalls = UnityEngine.Rendering.GraphicsSettings.renderPipelineAsset ? 
            UnityEngine.Rendering.GraphicsSettings.renderPipelineAsset.GetType().GetField("drawCalls", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)?.GetValue(UnityEngine.Rendering.GraphicsSettings.renderPipelineAsset) as int? ?? 0 : 0;
    }
    
    private void OnGUI()
    {
        if (enableProfiling)
        {
            GUILayout.BeginArea(new Rect(10, 10, 200, 100));
            GUILayout.Label($"FPS: {fps:F1}");
            GUILayout.Label($"Memory: {memoryUsage:F1}MB");
            GUILayout.Label($"Draw Calls: {drawCalls}");
            GUILayout.EndArea();
        }
    }
}
```

## 🎮 **Mobile-Specific Features**

### **1. Responsive UI**
```csharp
public class ResponsiveUI : MonoBehaviour
{
    [Header("Screen Breakpoints")]
    public float mobileBreakpoint = 768f;
    public float tabletBreakpoint = 1024f;
    
    [Header("UI Elements")]
    public GameObject[] mobileUI;
    public GameObject[] desktopUI;
    
    private void Start()
    {
        SetupResponsiveUI();
    }
    
    private void SetupResponsiveUI()
    {
        float screenWidth = Screen.width;
        
        if (screenWidth <= mobileBreakpoint)
        {
            // Mobile UI
            SetUIActive(mobileUI, true);
            SetUIActive(desktopUI, false);
        }
        else
        {
            // Desktop UI
            SetUIActive(mobileUI, false);
            SetUIActive(desktopUI, true);
        }
    }
    
    private void SetUIActive(GameObject[] uiElements, bool active)
    {
        foreach (GameObject element in uiElements)
        {
            if (element != null)
                element.SetActive(active);
        }
    }
}
```

### **2. Touch Gestures**
```csharp
public class TouchGestures : MonoBehaviour
{
    [Header("Gesture Settings")]
    public float swipeThreshold = 50f;
    public float pinchThreshold = 0.1f;
    
    private Vector2 startTouch1;
    private Vector2 startTouch2;
    private float startDistance;
    
    private void Update()
    {
        if (Input.touchCount == 1)
        {
            HandleSingleTouch();
        }
        else if (Input.touchCount == 2)
        {
            HandleMultiTouch();
        }
    }
    
    private void HandleSingleTouch()
    {
        Touch touch = Input.GetTouch(0);
        
        switch (touch.phase)
        {
            case TouchPhase.Began:
                startTouch1 = touch.position;
                break;
            case TouchPhase.Ended:
                Vector2 delta = touch.position - startTouch1;
                if (delta.magnitude > swipeThreshold)
                {
                    OnSwipe(delta);
                }
                break;
        }
    }
    
    private void HandleMultiTouch()
    {
        Touch touch1 = Input.GetTouch(0);
        Touch touch2 = Input.GetTouch(1);
        
        if (touch1.phase == TouchPhase.Began || touch2.phase == TouchPhase.Began)
        {
            startTouch1 = touch1.position;
            startTouch2 = touch2.position;
            startDistance = Vector2.Distance(startTouch1, startTouch2);
        }
        else if (touch1.phase == TouchPhase.Moved || touch2.phase == TouchPhase.Moved)
        {
            float currentDistance = Vector2.Distance(touch1.position, touch2.position);
            float deltaDistance = currentDistance - startDistance;
            
            if (Mathf.Abs(deltaDistance) > pinchThreshold)
            {
                OnPinch(deltaDistance);
            }
        }
    }
    
    private void OnSwipe(Vector2 direction)
    {
        // Handle swipe gesture
        Debug.Log($"Swipe: {direction}");
    }
    
    private void OnPinch(float delta)
    {
        // Handle pinch gesture
        Debug.Log($"Pinch: {delta}");
    }
}
```

## 🚀 **Testing and Optimization**

### **1. Performance Testing**
```csharp
public class PerformanceTester : MonoBehaviour
{
    [Header("Test Settings")]
    public int testDuration = 60; // seconds
    public bool runAutomatedTest = false;
    
    private List<float> fpsSamples = new List<float>();
    private List<float> memorySamples = new List<float>();
    
    private void Start()
    {
        if (runAutomatedTest)
        {
            StartCoroutine(RunPerformanceTest());
        }
    }
    
    private IEnumerator RunPerformanceTest()
    {
        float startTime = Time.time;
        
        while (Time.time - startTime < testDuration)
        {
            // Sample performance metrics
            fpsSamples.Add(1f / Time.deltaTime);
            memorySamples.Add((float)System.GC.GetTotalMemory(false) / (1024 * 1024));
            
            yield return new WaitForSeconds(0.1f);
        }
        
        // Analyze results
        AnalyzePerformanceResults();
    }
    
    private void AnalyzePerformanceResults()
    {
        float avgFPS = fpsSamples.Average();
        float minFPS = fpsSamples.Min();
        float avgMemory = memorySamples.Average();
        float maxMemory = memorySamples.Max();
        
        Debug.Log($"Performance Test Results:");
        Debug.Log($"Average FPS: {avgFPS:F1}");
        Debug.Log($"Minimum FPS: {minFPS:F1}");
        Debug.Log($"Average Memory: {avgMemory:F1}MB");
        Debug.Log($"Maximum Memory: {maxMemory:F1}MB");
    }
}
```

### **2. Build Settings for Mobile**
```csharp
// Unity Build Settings for Mobile WebGL
public class MobileBuildSettings
{
    public static void ConfigureMobileBuild()
    {
        // Player Settings
        PlayerSettings.SetScriptingBackend(BuildTargetGroup.WebGL, ScriptingImplementation.IL2CPP);
        PlayerSettings.SetApiCompatibilityLevel(BuildTargetGroup.WebGL, ApiCompatibilityLevel.NET_Standard_2_1);
        
        // WebGL Settings
        PlayerSettings.WebGL.compressionFormat = WebGLCompressionFormat.Gzip;
        PlayerSettings.WebGL.dataCaching = true;
        PlayerSettings.WebGL.exceptionSupport = WebGLExceptionSupport.Full;
        PlayerSettings.WebGL.codeStrippingLevel = CodeStrippingLevel.Minimal;
        PlayerSettings.WebGL.managedStrippingLevel = ManagedStrippingLevel.Minimal;
        
        // Quality Settings
        QualitySettings.SetQualityLevel(0); // Fastest quality
        QualitySettings.pixelLightCount = 1;
        QualitySettings.textureQuality = 0.5f; // Half resolution
        QualitySettings.anisotropicFiltering = AnisotropicFiltering.Disable;
        QualitySettings.antiAliasing = 0;
        QualitySettings.softVegetation = false;
        QualitySettings.realtimeReflectionProbes = false;
    }
}
```

## 📱 **Mobile-Specific Considerations**

### **1. Battery Optimization**
- **Reduce CPU usage** - Use coroutines instead of Update()
- **Limit frame rate** - Cap at 30 FPS on mobile
- **Optimize shaders** - Use mobile-optimized shaders
- **Reduce draw calls** - Use sprite atlases

### **2. Touch Input**
- **Large touch targets** - Minimum 44x44 pixels
- **Touch feedback** - Visual/audio feedback
- **Gesture support** - Swipe, pinch, tap
- **Accessibility** - Support for assistive technologies

### **3. Screen Adaptation**
- **Safe areas** - Handle notched devices
- **Orientation** - Support portrait/landscape
- **Resolution scaling** - Adapt to different screen sizes
- **DPI scaling** - Handle high-DPI displays

---

**Next:** [Steam Integration Guide](steam-integration.md)
