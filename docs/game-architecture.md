# Game Architecture Guide

## 🏗️ **System Architecture Overview**

### **Core Systems Design**
```
┌─────────────────────────────────────────────────────────────┐
│                    Chaos World Game                        │
├─────────────────────────────────────────────────────────────┤
│  Presentation Layer (Unity UI)                             │
├─────────────────────────────────────────────────────────────┤
│  Game Logic Layer (C# Scripts)                            │
│  ├── Cultivation System                                    │
│  ├── Combat System                                         │
│  ├── Inventory System                                      │
│  ├── Character System                                      │
│  └── World System                                          │
├─────────────────────────────────────────────────────────────┤
│  Data Layer (ScriptableObjects)                           │
│  ├── Character Data                                        │
│  ├── Item Data                                             │
│  ├── Cultivation Data                                      │
│  └── World Data                                            │
├─────────────────────────────────────────────────────────────┤
│  Backend Integration (WebGL + API)                         │
│  ├── Authentication                                        │
│  ├── Save System                                           │
│  ├── Multiplayer                                           │
│  └── Steam Integration                                     │
└─────────────────────────────────────────────────────────────┘
```

## 🎮 **Core Game Systems**

### **1. Cultivation System**

#### **Cultivation Realms**
```csharp
public enum CultivationRealm
{
    QiRefining,        // 练气期
    FoundationBuilding, // 筑基期
    CoreFormation,     // 结丹期
    NascentSoul,       // 元婴期
    SpiritTransformation, // 化神期
    BodyRefining,      // 炼体期
    SoulRefining,      // 炼魂期
    Immortal           // 仙人期
}

public class CultivationSystem : MonoBehaviour
{
    [SerializeField] private CultivationData cultivationData;
    [SerializeField] private CharacterStats characterStats;
    
    public void Cultivate(float timeSpent)
    {
        // Calculate cultivation progress
        float progress = CalculateCultivationProgress(timeSpent);
        
        // Update character stats
        UpdateCharacterStats(progress);
        
        // Check for realm breakthrough
        CheckRealmBreakthrough();
    }
}
```

#### **Cultivation Techniques**
```csharp
[CreateAssetMenu(fileName = "CultivationTechnique", menuName = "Game/Cultivation/Technique")]
public class CultivationTechnique : ScriptableObject
{
    public string techniqueName;
    public CultivationRealm requiredRealm;
    public float cultivationSpeed;
    public float breakthroughChance;
    public List<ResourceCost> resourceCosts;
    public List<StatBonus> statBonuses;
}
```

### **2. Character System**

#### **Character Stats**
```csharp
[System.Serializable]
public class CharacterStats
{
    [Header("Basic Stats")]
    public int level;
    public CultivationRealm realm;
    public float experience;
    
    [Header("Combat Stats")]
    public int health;
    public int maxHealth;
    public int mana;
    public int maxMana;
    public int attack;
    public int defense;
    public int speed;
    
    [Header("Cultivation Stats")]
    public float cultivationSpeed;
    public float breakthroughChance;
    public float spiritualRoot;
    
    [Header("Resources")]
    public int spiritStones;
    public int pills;
    public int artifacts;
}
```

#### **Character Progression**
```csharp
public class CharacterProgression : MonoBehaviour
{
    [SerializeField] private CharacterStats stats;
    [SerializeField] private CultivationSystem cultivationSystem;
    
    public void GainExperience(int amount)
    {
        stats.experience += amount;
        CheckLevelUp();
    }
    
    private void CheckLevelUp()
    {
        int requiredExp = GetRequiredExperience(stats.level);
        if (stats.experience >= requiredExp)
        {
            LevelUp();
        }
    }
    
    private void LevelUp()
    {
        stats.level++;
        stats.experience -= GetRequiredExperience(stats.level - 1);
        
        // Increase stats
        IncreaseStats();
        
        // Trigger level up events
        OnLevelUp?.Invoke(stats.level);
    }
}
```

### **3. Combat System**

#### **Turn-Based Combat**
```csharp
public class CombatSystem : MonoBehaviour
{
    [SerializeField] private List<Combatant> combatants;
    [SerializeField] private int currentTurn;
    
    public void StartCombat(List<Combatant> enemies)
    {
        combatants.Clear();
        combatants.AddRange(enemies);
        currentTurn = 0;
        
        StartCoroutine(CombatLoop());
    }
    
    private IEnumerator CombatLoop()
    {
        while (!IsCombatOver())
        {
            Combatant current = combatants[currentTurn];
            yield return StartCoroutine(ExecuteTurn(current));
            
            currentTurn = (currentTurn + 1) % combatants.Count;
        }
        
        EndCombat();
    }
}
```

#### **Combat Techniques**
```csharp
[CreateAssetMenu(fileName = "CombatTechnique", menuName = "Game/Combat/Technique")]
public class CombatTechnique : ScriptableObject
{
    public string techniqueName;
    public int manaCost;
    public int damage;
    public float accuracy;
    public TechniqueType type;
    public List<StatusEffect> statusEffects;
}

public enum TechniqueType
{
    Attack,
    Defense,
    Healing,
    Buff,
    Debuff,
    Special
}
```

### **4. Inventory System**

#### **Item System**
```csharp
[CreateAssetMenu(fileName = "Item", menuName = "Game/Items/Item")]
public class Item : ScriptableObject
{
    public string itemName;
    public string description;
    public ItemType type;
    public ItemRarity rarity;
    public int value;
    public Sprite icon;
    public List<ItemEffect> effects;
}

public enum ItemType
{
    Pill,           // 丹药
    Artifact,       // 法宝
    Material,       // 材料
    Technique,      // 功法
    SpiritStone,    // 灵石
    Other
}
```

#### **Inventory Management**
```csharp
public class InventorySystem : MonoBehaviour
{
    [SerializeField] private List<InventorySlot> inventory;
    [SerializeField] private int maxSlots;
    
    public bool AddItem(Item item, int quantity)
    {
        // Check if item already exists
        InventorySlot existingSlot = inventory.Find(slot => slot.item == item);
        if (existingSlot != null)
        {
            existingSlot.quantity += quantity;
            return true;
        }
        
        // Add new item
        if (inventory.Count < maxSlots)
        {
            inventory.Add(new InventorySlot(item, quantity));
            return true;
        }
        
        return false; // Inventory full
    }
}
```

### **5. World System**

#### **World Regions**
```csharp
[CreateAssetMenu(fileName = "WorldRegion", menuName = "Game/World/Region")]
public class WorldRegion : ScriptableObject
{
    public string regionName;
    public string description;
    public CultivationRealm requiredRealm;
    public List<WorldLocation> locations;
    public List<WorldEvent> events;
    public List<WorldNPC> npcs;
}
```

#### **World Exploration**
```csharp
public class WorldExploration : MonoBehaviour
{
    [SerializeField] private WorldRegion currentRegion;
    [SerializeField] private WorldLocation currentLocation;
    
    public void TravelToLocation(WorldLocation location)
    {
        if (CanTravelToLocation(location))
        {
            currentLocation = location;
            OnLocationChanged?.Invoke(location);
            
            // Trigger location events
            TriggerLocationEvents(location);
        }
    }
    
    private bool CanTravelToLocation(WorldLocation location)
    {
        return GameManager.Instance.PlayerStats.realm >= location.requiredRealm;
    }
}
```

## 🔧 **Technical Implementation**

### **1. Singleton Pattern for Managers**
```csharp
public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }
    
    [Header("Game Systems")]
    public CharacterStats PlayerStats;
    public InventorySystem PlayerInventory;
    public CultivationSystem CultivationSystem;
    public CombatSystem CombatSystem;
    public WorldExploration WorldExploration;
    
    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }
}
```

### **2. Event System**
```csharp
public class GameEvents : MonoBehaviour
{
    public static GameEvents Instance { get; private set; }
    
    // Character Events
    public UnityEvent<int> OnLevelUp;
    public UnityEvent<CultivationRealm> OnRealmBreakthrough;
    public UnityEvent<Item> OnItemObtained;
    
    // Combat Events
    public UnityEvent<Combatant> OnCombatStart;
    public UnityEvent<Combatant> OnCombatEnd;
    public UnityEvent<Combatant> OnCombatantDefeated;
    
    // World Events
    public UnityEvent<WorldLocation> OnLocationChanged;
    public UnityEvent<WorldEvent> OnWorldEventTriggered;
}
```

### **3. Save System**
```csharp
public class SaveSystem : MonoBehaviour
{
    public void SaveGame()
    {
        GameSaveData saveData = new GameSaveData
        {
            playerStats = GameManager.Instance.PlayerStats,
            playerInventory = GameManager.Instance.PlayerInventory.GetSaveData(),
            currentLocation = GameManager.Instance.WorldExploration.currentLocation,
            gameTime = Time.time
        };
        
        string json = JsonUtility.ToJson(saveData);
        PlayerPrefs.SetString("GameSave", json);
    }
    
    public void LoadGame()
    {
        string json = PlayerPrefs.GetString("GameSave");
        if (!string.IsNullOrEmpty(json))
        {
            GameSaveData saveData = JsonUtility.FromJson<GameSaveData>(json);
            LoadGameData(saveData);
        }
    }
}
```

## 🎯 **Performance Considerations**

### **1. Object Pooling**
```csharp
public class ObjectPool : MonoBehaviour
{
    [SerializeField] private GameObject prefab;
    [SerializeField] private int poolSize;
    private Queue<GameObject> pool;
    
    private void Start()
    {
        pool = new Queue<GameObject>();
        for (int i = 0; i < poolSize; i++)
        {
            GameObject obj = Instantiate(prefab);
            obj.SetActive(false);
            pool.Enqueue(obj);
        }
    }
    
    public GameObject GetObject()
    {
        if (pool.Count > 0)
        {
            GameObject obj = pool.Dequeue();
            obj.SetActive(true);
            return obj;
        }
        return Instantiate(prefab);
    }
}
```

### **2. UI Optimization**
```csharp
public class UIManager : MonoBehaviour
{
    [SerializeField] private Canvas mainCanvas;
    [SerializeField] private List<GameObject> uiPanels;
    
    public void ShowPanel(string panelName)
    {
        // Hide all panels
        foreach (GameObject panel in uiPanels)
        {
            panel.SetActive(false);
        }
        
        // Show specific panel
        GameObject targetPanel = uiPanels.Find(p => p.name == panelName);
        if (targetPanel != null)
        {
            targetPanel.SetActive(true);
        }
    }
}
```

## 🚀 **Next Steps**

1. **Read [Mobile Optimization](mobile-optimization.md)** for performance tips
2. **Follow [Steam Integration](steam-integration.md)** for Steam features
3. **Start implementing core systems** in Unity
4. **Test on WebGL** regularly

---

**Next:** [Mobile Optimization Guide](mobile-optimization.md)
