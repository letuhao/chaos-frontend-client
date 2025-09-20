/**
 * Game Types
 * Type definitions for the Chaos World game
 */

// Player Data Types
export interface PlayerData {
  level: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  experience: number;
  cultivationLevel: number;
  cultivationProgress: number;
  currentRealm: string;
  realmLevel: number;
}

// Game State Types
export interface GameState {
  player: PlayerData;
  game: {
    isPaused: boolean;
    isInCombat: boolean;
    currentScene: string;
  };
  inventory?: InventoryData;
}

// Cultivation Types
export interface CultivationData {
  currentRealm: string;
  realmLevel: number;
  cultivationProgress: number;
  isCultivating: boolean;
}

export interface CultivationProgress {
  progress: number;
  breakthrough: boolean;
  realm: string;
}

// Combat Types
export interface CombatData {
  player: PlayerStatsUpdate;
  enemy: EnemyData;
  status: CombatStatus;
  techniques?: CombatTechnique[];
  items?: CombatItem[];
}

export interface EnemyData {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  level: number;
  type: string;
}

export type CombatStatus = 'fighting' | 'player-turn' | 'enemy-turn' | 'victory' | 'defeat' | 'fled';

export interface CombatTechnique {
  id: string;
  name: string;
  description: string;
  manaCost: number;
  damage: number;
  cooldown: number;
  type: 'offensive' | 'defensive' | 'support';
}

export interface CombatItem {
  id: string;
  name: string;
  description: string;
  type: 'potion' | 'scroll' | 'consumable';
  effect: string;
  quantity: number;
}

// Inventory Types
export interface InventoryData {
  items: InventoryItem[];
  maxSlots: number;
  totalWeight: number;
  maxWeight: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  type: ItemType;
  rarity: ItemRarity;
  quantity: number;
  weight: number;
  stackable: boolean;
  stats?: ItemStats;
  icon?: string;
}

export type ItemType = 'weapon' | 'armor' | 'potion' | 'scroll' | 'gem' | 'herb' | 'book' | 'key' | 'coin' | 'consumable' | 'misc';
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface ItemStats {
  [key: string]: number;
}

// UI Types
export interface UIElement {
  id: string;
  visible: boolean;
  enabled: boolean;
}

export interface NotificationData {
  message: string;
  type: NotificationType;
  duration: number;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface AchievementData {
  id: string;
  name: string;
  description: string;
  hidden: boolean;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

// Unity Communication Types
export interface UnityMessage {
  method: string;
  data: any;
}

export interface PlayerStatsUpdate {
  level?: number;
  health?: number;
  maxHealth?: number;
  mana?: number;
  maxMana?: number;
  experience?: number;
  cultivationLevel?: number;
  cultivationProgress?: number;
}

// Steam Integration Types
export interface SteamConfig {
  steam: {
    appId: string;
    webApiKey: string;
    communityUrl: string;
    storeUrl: string;
    apiUrl: string;
  };
  achievements: AchievementData[];
  cloudSaves: {
    enabled: boolean;
    maxSaves: number;
    autoSave: boolean;
    autoSaveInterval: number;
    saveFileName: string;
  };
  friends: {
    enabled: boolean;
    showOnlineFriends: boolean;
    showFriendsPlayingGame: boolean;
    maxFriendsDisplay: number;
  };
  webgl: {
    enableSteamOverlay: boolean;
    enableSteamInput: boolean;
    enableSteamController: boolean;
    fallbackToCustomOverlay: boolean;
  };
}

// Event Types
export interface GameEvent {
  type: string;
  data: any;
  timestamp: Date;
}

export interface UnityEvent extends GameEvent {
  type: 'PlayerStatsUpdated' | 'CultivationProgress' | 'CombatStarted' | 'CombatEnded' | 'InventoryUpdated' | 'GameStateChanged' | 'Error';
}

export interface SteamEvent extends GameEvent {
  type: 'AchievementUnlocked' | 'CloudSaveLoaded' | 'FriendStatusChanged';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface HealthStatus {
  healthy: boolean;
  uptime?: string;
  version?: string;
  responseTime?: number;
}

export interface MetricsInfo {
  totalRequests: number;
  averageResponseTime: number;
  errorRate: number;
  uptime: string;
}

// Configuration Types
export interface GameConfig {
  server: {
    host: string;
    port: number;
    protocol: 'http' | 'https';
  };
  unity: {
    buildPath: string;
    dataPath: string;
    frameworkPath: string;
  };
  steam: SteamConfig;
  ui: {
    theme: 'dark' | 'light';
    language: 'en' | 'zh' | 'vi';
    animations: boolean;
    soundEnabled: boolean;
    musicEnabled: boolean;
  };
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Authentication Types
export type AuthMode = 'welcome' | 'login' | 'register';

export interface AuthFormData {
    username: string;
    password: string;
    confirmPassword?: string;
    email?: string;
    rememberMe?: boolean;
    agreeToTerms?: boolean;
    isGuest?: boolean;
    socialProvider?: 'google' | 'steam' | 'discord';
}

export interface UserProfile {
    id: string;
    username: string;
    email: string;
    displayName: string;
    avatar?: string;
    level: number;
    joinDate: Date;
    lastLogin?: Date;
}

// Event Handler Types
export type EventHandler<T = any> = (data: T) => void;
export type UnityEventHandler = EventHandler<UnityEvent>;
export type SteamEventHandler = EventHandler<SteamEvent>;
export type GameEventHandler = EventHandler<GameEvent>;