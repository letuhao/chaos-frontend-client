# Steam Integration Guide

## 🎮 **Steam WebGL Integration Strategy**

### **Why Steam + WebGL?**
- **Broader reach** - WebGL works on any device with a browser
- **No installation** - Players can try immediately
- **Steam features** - Achievements, cloud saves, friends
- **Revenue potential** - Steam's payment system
- **Future flexibility** - Easy migration to standalone

## 🔧 **Steam Web API Integration**

### **1. Steam Web API Setup**

#### **Steam Web API Key**
```csharp
public class SteamWebAPI : MonoBehaviour
{
    [Header("Steam Configuration")]
    public string steamWebAPIKey = "YOUR_STEAM_WEB_API_KEY";
    public string steamAppID = "YOUR_STEAM_APP_ID";
    
    [Header("API Endpoints")]
    private string baseURL = "https://api.steampowered.com";
    private string steamLoginURL = "https://steamcommunity.com/openid/login";
    
    private void Start()
    {
        InitializeSteamWebAPI();
    }
    
    private void InitializeSteamWebAPI()
    {
        // Initialize Steam Web API
        Debug.Log("Steam Web API initialized");
    }
}
```

#### **Steam Authentication**
```csharp
public class SteamAuthentication : MonoBehaviour
{
    [Header("Steam Auth")]
    public string returnURL = "https://yourgame.com/auth/steam";
    public string realm = "https://yourgame.com";
    
    public void StartSteamLogin()
    {
        string steamLoginURL = BuildSteamLoginURL();
        Application.OpenURL(steamLoginURL);
    }
    
    private string BuildSteamLoginURL()
    {
        var parameters = new Dictionary<string, string>
        {
            {"openid.ns", "http://specs.openid.net/auth/2.0"},
            {"openid.mode", "checkid_setup"},
            {"openid.return_to", returnURL},
            {"openid.realm", realm},
            {"openid.identity", "http://specs.openid.net/auth/2.0/identifier_select"},
            {"openid.claimed_id", "http://specs.openid.net/auth/2.0/identifier_select"}
        };
        
        string queryString = string.Join("&", parameters.Select(kvp => $"{kvp.Key}={Uri.EscapeDataString(kvp.Value)}"));
        return $"https://steamcommunity.com/openid/login?{queryString}";
    }
    
    public void HandleSteamCallback(string callbackURL)
    {
        // Parse Steam callback and get user info
        StartCoroutine(ProcessSteamCallback(callbackURL));
    }
    
    private IEnumerator ProcessSteamCallback(string callbackURL)
    {
        // Extract Steam ID from callback
        string steamID = ExtractSteamID(callbackURL);
        
        if (!string.IsNullOrEmpty(steamID))
        {
            // Get user info from Steam
            yield return StartCoroutine(GetSteamUserInfo(steamID));
        }
    }
    
    private string ExtractSteamID(string callbackURL)
    {
        // Parse Steam ID from OpenID response
        // Implementation depends on your callback handling
        return "76561198000000000"; // Placeholder
    }
    
    private IEnumerator GetSteamUserInfo(string steamID)
    {
        string url = $"https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={steamWebAPIKey}&steamids={steamID}";
        
        using (UnityWebRequest request = UnityWebRequest.Get(url))
        {
            yield return request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success)
            {
                SteamUserData userData = JsonUtility.FromJson<SteamUserData>(request.downloadHandler.text);
                OnSteamUserAuthenticated(userData);
            }
        }
    }
}
```

### **2. Steam Achievements**

#### **Achievement System**
```csharp
[System.Serializable]
public class SteamAchievement
{
    public string achievementID;
    public string name;
    public string description;
    public bool unlocked;
    public Sprite icon;
}

public class SteamAchievements : MonoBehaviour
{
    [Header("Achievements")]
    public List<SteamAchievement> achievements;
    
    [Header("Steam API")]
    public string steamWebAPIKey;
    public string steamAppID;
    
    private string steamID;
    
    public void UnlockAchievement(string achievementID)
    {
        SteamAchievement achievement = achievements.Find(a => a.achievementID == achievementID);
        if (achievement != null && !achievement.unlocked)
        {
            StartCoroutine(UnlockSteamAchievement(achievementID));
        }
    }
    
    private IEnumerator UnlockSteamAchievement(string achievementID)
    {
        string url = $"https://api.steampowered.com/ISteamUserStats/SetUserAchievement/v0001/";
        
        var formData = new List<IMultipartFormSection>
        {
            new MultipartFormDataSection("key", steamWebAPIKey),
            new MultipartFormDataSection("appid", steamAppID),
            new MultipartFormDataSection("steamid", steamID),
            new MultipartFormDataSection("achievementid", achievementID)
        };
        
        using (UnityWebRequest request = UnityWebRequest.Post(url, formData))
        {
            yield return request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success)
            {
                Debug.Log($"Achievement unlocked: {achievementID}");
                OnAchievementUnlocked(achievementID);
            }
        }
    }
    
    private void OnAchievementUnlocked(string achievementID)
    {
        SteamAchievement achievement = achievements.Find(a => a.achievementID == achievementID);
        if (achievement != null)
        {
            achievement.unlocked = true;
            // Show achievement notification
            ShowAchievementNotification(achievement);
        }
    }
    
    private void ShowAchievementNotification(SteamAchievement achievement)
    {
        // Show achievement popup
        Debug.Log($"Achievement Unlocked: {achievement.name}");
    }
}
```

### **3. Steam Cloud Saves**

#### **Cloud Save System**
```csharp
public class SteamCloudSaves : MonoBehaviour
{
    [Header("Cloud Save Settings")]
    public string steamWebAPIKey;
    public string steamAppID;
    public int maxCloudSaves = 10;
    
    private string steamID;
    
    public void SaveToCloud(GameSaveData saveData)
    {
        StartCoroutine(UploadSaveToCloud(saveData));
    }
    
    private IEnumerator UploadSaveToCloud(GameSaveData saveData)
    {
        string saveDataJson = JsonUtility.ToJson(saveData);
        byte[] saveDataBytes = System.Text.Encoding.UTF8.GetBytes(saveDataJson);
        
        string url = $"https://api.steampowered.com/ISteamRemoteStorage/WriteFile/v0001/";
        
        var formData = new List<IMultipartFormSection>
        {
            new MultipartFormDataSection("key", steamWebAPIKey),
            new MultipartFormDataSection("appid", steamAppID),
            new MultipartFormDataSection("steamid", steamID),
            new MultipartFormDataSection("filename", "gamesave.json"),
            new MultipartFormDataSection("filecontent", saveDataBytes)
        };
        
        using (UnityWebRequest request = UnityWebRequest.Post(url, formData))
        {
            yield return request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success)
            {
                Debug.Log("Save uploaded to Steam Cloud");
                OnCloudSaveComplete(true);
            }
            else
            {
                Debug.LogError("Failed to upload save to Steam Cloud");
                OnCloudSaveComplete(false);
            }
        }
    }
    
    public void LoadFromCloud()
    {
        StartCoroutine(DownloadSaveFromCloud());
    }
    
    private IEnumerator DownloadSaveFromCloud()
    {
        string url = $"https://api.steampowered.com/ISteamRemoteStorage/GetFile/v0001/?key={steamWebAPIKey}&appid={steamAppID}&steamid={steamID}&filename=gamesave.json";
        
        using (UnityWebRequest request = UnityWebRequest.Get(url))
        {
            yield return request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success)
            {
                string saveDataJson = request.downloadHandler.text;
                GameSaveData saveData = JsonUtility.FromJson<GameSaveData>(saveDataJson);
                OnCloudSaveLoaded(saveData);
            }
            else
            {
                Debug.LogError("Failed to load save from Steam Cloud");
                OnCloudSaveLoaded(null);
            }
        }
    }
    
    private void OnCloudSaveComplete(bool success)
    {
        // Handle cloud save completion
        if (success)
        {
            Debug.Log("Cloud save successful");
        }
        else
        {
            Debug.Log("Cloud save failed, using local save");
        }
    }
    
    private void OnCloudSaveLoaded(GameSaveData saveData)
    {
        if (saveData != null)
        {
            // Load the save data
            GameManager.Instance.LoadGame(saveData);
        }
        else
        {
            // Fallback to local save
            GameManager.Instance.LoadLocalSave();
        }
    }
}
```

### **4. Steam Friends Integration**

#### **Friends System**
```csharp
public class SteamFriends : MonoBehaviour
{
    [Header("Steam Friends")]
    public string steamWebAPIKey;
    public string steamAppID;
    
    private string steamID;
    private List<SteamFriend> friends;
    
    public void LoadFriends()
    {
        StartCoroutine(GetSteamFriends());
    }
    
    private IEnumerator GetSteamFriends()
    {
        string url = $"https://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key={steamWebAPIKey}&steamid={steamID}&relationship=friend";
        
        using (UnityWebRequest request = UnityWebRequest.Get(url))
        {
            yield return request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success)
            {
                SteamFriendsData friendsData = JsonUtility.FromJson<SteamFriendsData>(request.downloadHandler.text);
                ProcessFriendsData(friendsData);
            }
        }
    }
    
    private void ProcessFriendsData(SteamFriendsData friendsData)
    {
        friends = new List<SteamFriend>();
        
        foreach (var friend in friendsData.friendslist.friends)
        {
            StartCoroutine(GetFriendInfo(friend.steamid));
        }
    }
    
    private IEnumerator GetFriendInfo(string friendSteamID)
    {
        string url = $"https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={steamWebAPIKey}&steamids={friendSteamID}";
        
        using (UnityWebRequest request = UnityWebRequest.Get(url))
        {
            yield return request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success)
            {
                SteamUserData userData = JsonUtility.FromJson<SteamUserData>(request.downloadHandler.text);
                if (userData.response.players.Count > 0)
                {
                    SteamFriend friend = new SteamFriend
                    {
                        steamID = friendSteamID,
                        personaName = userData.response.players[0].personaname,
                        avatar = userData.response.players[0].avatar,
                        gameExtraInfo = userData.response.players[0].gameextrainfo
                    };
                    friends.Add(friend);
                }
            }
        }
    }
    
    public List<SteamFriend> GetOnlineFriends()
    {
        return friends.Where(f => !string.IsNullOrEmpty(f.gameExtraInfo)).ToList();
    }
    
    public List<SteamFriend> GetFriendsPlayingGame()
    {
        return friends.Where(f => f.gameExtraInfo.Contains("Chaos World")).ToList();
    }
}
```

## 🎮 **Steam Features Implementation**

### **1. Steam Overlay (Limited in WebGL)**
```csharp
public class SteamOverlay : MonoBehaviour
{
    [Header("Overlay Settings")]
    public bool enableOverlay = true;
    
    private void Update()
    {
        if (enableOverlay && Input.GetKeyDown(KeyCode.F12))
        {
            // Steam overlay doesn't work in WebGL
            // Show custom overlay instead
            ShowCustomOverlay();
        }
    }
    
    private void ShowCustomOverlay()
    {
        // Custom overlay implementation
        Debug.Log("Custom Steam-like overlay");
    }
}
```

### **2. Steam Workshop (Future Feature)**
```csharp
public class SteamWorkshop : MonoBehaviour
{
    [Header("Workshop Settings")]
    public string steamWebAPIKey;
    public string steamAppID;
    
    public void UploadToWorkshop(string itemName, string description, byte[] itemData)
    {
        StartCoroutine(UploadWorkshopItem(itemName, description, itemData));
    }
    
    private IEnumerator UploadWorkshopItem(string itemName, string description, byte[] itemData)
    {
        // Workshop upload implementation
        // This would require Steam SDK for full functionality
        yield return null;
    }
}
```

### **3. Steam Trading Cards**
```csharp
public class SteamTradingCards : MonoBehaviour
{
    [Header("Trading Cards")]
    public List<SteamTradingCard> tradingCards;
    
    public void GrantTradingCard(string cardID)
    {
        StartCoroutine(GrantSteamTradingCard(cardID));
    }
    
    private IEnumerator GrantSteamTradingCard(string cardID)
    {
        // Trading card granting implementation
        yield return null;
    }
}
```

## 🚀 **Deployment Strategy**

### **1. Steam Store Page Setup**
```csharp
public class SteamStoreIntegration : MonoBehaviour
{
    [Header("Store Settings")]
    public string steamAppID;
    public string storeURL = "https://store.steampowered.com/app/";
    
    public void OpenSteamStore()
    {
        string fullURL = $"{storeURL}{steamAppID}";
        Application.OpenURL(fullURL);
    }
    
    public void OpenSteamReviews()
    {
        string reviewsURL = $"{storeURL}{steamAppID}/#reviews";
        Application.OpenURL(reviewsURL);
    }
}
```

### **2. Steam Analytics**
```csharp
public class SteamAnalytics : MonoBehaviour
{
    [Header("Analytics")]
    public string steamWebAPIKey;
    public string steamAppID;
    
    public void TrackEvent(string eventName, Dictionary<string, object> parameters)
    {
        StartCoroutine(SendAnalyticsEvent(eventName, parameters));
    }
    
    private IEnumerator SendAnalyticsEvent(string eventName, Dictionary<string, object> parameters)
    {
        // Analytics implementation
        yield return null;
    }
}
```

## 📱 **Mobile Steam Integration**

### **1. Mobile Steam App Integration**
```csharp
public class MobileSteamIntegration : MonoBehaviour
{
    [Header("Mobile Steam")]
    public bool enableMobileSteam = true;
    
    private void Start()
    {
        if (enableMobileSteam)
        {
            CheckMobileSteamApp();
        }
    }
    
    private void CheckMobileSteamApp()
    {
        // Check if Steam mobile app is available
        // This would require platform-specific implementation
        Debug.Log("Checking for Steam mobile app");
    }
}
```

### **2. Progressive Web App (PWA)**
```csharp
public class PWASteamIntegration : MonoBehaviour
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
        // PWA setup for Steam integration
        Debug.Log("Setting up PWA for Steam integration");
    }
}
```

## 🔧 **Testing and Debugging**

### **1. Steam API Testing**
```csharp
public class SteamAPITester : MonoBehaviour
{
    [Header("Testing")]
    public bool enableTesting = true;
    public string testSteamID = "76561198000000000";
    
    private void Start()
    {
        if (enableTesting)
        {
            StartCoroutine(RunSteamAPITests());
        }
    }
    
    private IEnumerator RunSteamAPITests()
    {
        // Test Steam API endpoints
        yield return StartCoroutine(TestSteamAuthentication());
        yield return StartCoroutine(TestSteamAchievements());
        yield return StartCoroutine(TestSteamCloudSaves());
    }
    
    private IEnumerator TestSteamAuthentication()
    {
        // Test authentication
        yield return null;
    }
    
    private IEnumerator TestSteamAchievements()
    {
        // Test achievements
        yield return null;
    }
    
    private IEnumerator TestSteamCloudSaves()
    {
        // Test cloud saves
        yield return null;
    }
}
```

## 🎯 **Future Migration Path**

### **1. Standalone Build Preparation**
```csharp
public class StandaloneMigration : MonoBehaviour
{
    [Header("Migration Settings")]
    public bool prepareForStandalone = true;
    
    private void Start()
    {
        if (prepareForStandalone)
        {
            SetupStandaloneFeatures();
        }
    }
    
    private void SetupStandaloneFeatures()
    {
        // Prepare for standalone Steam integration
        Debug.Log("Preparing for standalone Steam integration");
    }
}
```

### **2. Steam SDK Integration**
```csharp
public class SteamSDKIntegration : MonoBehaviour
{
    [Header("Steam SDK")]
    public bool useSteamSDK = false;
    
    private void Start()
    {
        if (useSteamSDK)
        {
            InitializeSteamSDK();
        }
    }
    
    private void InitializeSteamSDK()
    {
        // Initialize Steam SDK for standalone builds
        Debug.Log("Initializing Steam SDK");
    }
}
```

---

**Next:** [Deployment Guide](deployment.md)
