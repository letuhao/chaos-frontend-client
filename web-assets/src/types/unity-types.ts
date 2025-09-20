/**
 * Unity Types
 * Type definitions for Unity WebGL communication
 */

// Unity WebGL Global Types
declare global {
  interface Window {
    UnityLoader: any;
    unityInstance: any;
    UnityToHTML: UnityToHTMLInterface;
    gameUI: any;
  }
}

// Unity Loader Interface
export interface UnityLoader {
  instantiate(container: HTMLElement, buildUrl: string, config: UnityConfig): UnityInstance;
}

// Unity Instance Interface
export interface UnityInstance {
  SendMessage(gameObject: string, method: string, value: string): void;
  Module: UnityModule;
}

// Unity Module Interface
export interface UnityModule {
  onRuntimeInitialized?: () => void;
}

// Unity Configuration
export interface UnityConfig {
  onProgress?: (progress: number) => void;
  Module?: UnityModule;
}

// Unity to HTML Communication Interface
export interface UnityToHTMLInterface {
  onPlayerStatsUpdated: (data: string) => void;
  onCultivationProgress: (data: string) => void;
  onCombatStarted: (data: string) => void;
  onCombatEnded: (data: string) => void;
  onInventoryUpdated: (data: string) => void;
  onGameStateChanged: (data: string) => void;
  onError: (message: string) => void;
}

// Unity Message Types
export interface UnityMessage {
  method: string;
  data: any;
}

// Unity Event Data Types
export interface UnityPlayerStatsData {
  level: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  experience: number;
  cultivationLevel: number;
  cultivationProgress: number;
}

export interface UnityCultivationData {
  progress: number;
  breakthrough: boolean;
  realm: string;
  level: number;
}

export interface UnityCombatData {
  player: UnityPlayerStatsData;
  enemy: {
    id: string;
    name: string;
    health: number;
    maxHealth: number;
    level: number;
    type: string;
  };
  status: 'fighting' | 'player-turn' | 'enemy-turn' | 'victory' | 'defeat' | 'fled';
  techniques?: Array<{
    id: string;
    name: string;
    description: string;
    manaCost: number;
    damage: number;
    cooldown: number;
    type: 'offensive' | 'defensive' | 'support';
  }>;
  items?: Array<{
    id: string;
    name: string;
    description: string;
    type: 'potion' | 'scroll' | 'consumable';
    effect: string;
    quantity: number;
  }>;
}

export interface UnityInventoryData {
  items: Array<{
    id: string;
    name: string;
    description?: string;
    type: string;
    rarity: string;
    quantity: number;
    weight: number;
    stackable: boolean;
    stats?: Record<string, number>;
    icon?: string;
  }>;
  maxSlots: number;
  totalWeight: number;
  maxWeight: number;
}

export interface UnityGameStateData {
  player: UnityPlayerStatsData;
  game: {
    isPaused: boolean;
    isInCombat: boolean;
    currentScene: string;
  };
  inventory?: UnityInventoryData;
}

// Unity Method Names
export type UnityMethod = 
  | 'UpdatePlayerStats'
  | 'StartCultivation'
  | 'StopCultivation'
  | 'UseItem'
  | 'EquipItem'
  | 'StartCombat'
  | 'UseCombatTechnique'
  | 'TravelToLocation'
  | 'SaveGame'
  | 'LoadGame'
  | 'RealmBreakthrough'
  | 'Defend'
  | 'DropItem';

// Unity GameObject Names
export type UnityGameObject = 'HybridUIManager' | 'GameManager' | 'PlayerController' | 'CultivationSystem' | 'CombatSystem' | 'InventorySystem';

// Unity Communication Helper Types
export interface UnityBridgeConfig {
  gameObject: UnityGameObject;
  timeout: number;
  retryAttempts: number;
}

export interface UnityMessageQueue {
  method: UnityMethod;
  data: any;
  timestamp: number;
  retries: number;
}

// Unity Error Types
export interface UnityError {
  code: string;
  message: string;
  stack?: string;
}

// Unity Loading States
export type UnityLoadingState = 'idle' | 'loading' | 'ready' | 'error';

// Unity Performance Types
export interface UnityPerformance {
  fps: number;
  memory: number;
  drawCalls: number;
  triangles: number;
  vertices: number;
}

// Unity Build Configuration
export interface UnityBuildConfig {
  targetPlatform: 'WebGL';
  developmentBuild: boolean;
  scriptDebugging: boolean;
  compressionFormat: 'Gzip' | 'Brotli' | 'Disabled';
  dataCaching: boolean;
  exceptionSupport: 'None' | 'ExplicitlyThrownExceptionsOnly' | 'Full';
  codeStrippingLevel: 'Disabled' | 'StripUnusedCode' | 'StripByteCode' | 'UseModules';
  managedStrippingLevel: 'Disabled' | 'Minimal' | 'Low' | 'Medium' | 'High';
}

// Unity Player Settings
export interface UnityPlayerSettings {
  companyName: string;
  productName: string;
  version: string;
  bundleVersion: string;
  defaultScreenWidth: number;
  defaultScreenHeight: number;
  runInBackground: boolean;
  captureSingleScreen: boolean;
  usePlayerLog: boolean;
  stripEngineCode: boolean;
}

// Unity WebGL Settings
export interface UnityWebGLSettings {
  memorySize: number;
  wasmStreaming: boolean;
  wasmCodegen: boolean;
  wasmExceptionSupport: boolean;
  wasmFunctionReferences: boolean;
  wasmSimd: boolean;
  wasmBulkMemory: boolean;
  wasmMultiValue: boolean;
  wasmReferenceTypes: boolean;
  wasmSignExt: boolean;
  wasmTailCall: boolean;
  wasmThreads: boolean;
  wasmGc: boolean;
}

// Unity Quality Settings
export interface UnityQualitySettings {
  pixelLightCount: number;
  textureQuality: number;
  anisotropicFiltering: number;
  antiAliasing: number;
  softVegetation: boolean;
  realtimeReflectionProbes: boolean;
  billboardsFaceCameraPosition: boolean;
  vSyncCount: number;
  lodBias: number;
  maximumLODLevel: number;
  particleRaycastBudget: number;
  asyncUploadTimeSlice: number;
  asyncUploadBufferSize: number;
  asyncUploadPersistentBuffer: boolean;
  resolutionScalingFixedDPIFactor: number;
  renderScale: number;
}

// Unity Mobile Optimization
export interface UnityMobileOptimization {
  enableMobileOptimization: boolean;
  targetFramerate: number;
  maxTextureSize: number;
  textureCompression: 'DXT1' | 'DXT5' | 'ETC' | 'ETC2' | 'ASTC';
  audioCompression: 'Vorbis' | 'MP3' | 'PCM';
  audioQuality: number;
  particleSystemBudget: number;
  maxParticleCount: number;
}

// Export global types
export {};