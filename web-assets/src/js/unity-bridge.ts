/**
 * Unity WebGL Bridge
 * Handles communication between Unity and HTML/CSS UI
 */

import { UnityInstance, UnityMessage } from '../types/unity-types';
import { EventHandler } from '../types/game-types';

export class UnityBridge {
    private unityInstance: UnityInstance | null = null;
    public isReady: boolean = false;
    private eventListeners: Map<string, EventHandler[]> = new Map();
    private messageQueue: UnityMessage[] = [];
    
    constructor() {
        // Initialize properties are set above
    }
    
    async init(): Promise<void> {
        try {
            console.log('🔗 Initializing Unity Bridge...');
            
            // Wait for Unity to load
            await this.waitForUnity();
            
            // Setup Unity communication
            this.setupUnityCommunication();
            
            this.isReady = true;
            console.log('✅ Unity Bridge initialized');
            
            // Process queued messages
            this.processMessageQueue();
            
        } catch (error) {
            console.error('❌ Failed to initialize Unity Bridge:', error);
            throw error;
        }
    }
    
    private async waitForUnity(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Unity failed to load within timeout'));
            }, 30000);
            
            const checkUnity = () => {
                if (typeof window.UnityLoader !== 'undefined' && document.getElementById('unity-canvas')) {
                    clearTimeout(timeout);
                    this.loadUnity();
                    resolve();
                } else {
                    setTimeout(checkUnity, 100);
                }
            };
            
            checkUnity();
        });
    }
    
    private loadUnity(): void {
        try {
            this.unityInstance = window.UnityLoader.instantiate(
                document.getElementById('unity-canvas')!,
                'Build/chaos-world.json',
                {
                    onProgress: (progress: number) => {
                        this.updateLoadingProgress(progress);
                    },
                    Module: {
                        onRuntimeInitialized: () => {
                            console.log('🎮 Unity runtime initialized');
                            this.setupUnityCallbacks();
                        }
                    }
                }
            );
        } catch (error) {
            console.error('❌ Failed to load Unity:', error);
            throw error;
        }
    }
    
    private updateLoadingProgress(progress: number): void {
        const progressBar = document.getElementById('loading-progress');
        const progressText = document.getElementById('loading-text');
        
        if (progressBar) {
            progressBar.style.width = `${progress * 100}%`;
        }
        
        if (progressText) {
            progressText.textContent = `Loading... ${Math.round(progress * 100)}%`;
        }
    }
    
    private setupUnityCommunication(): void {
        // Setup global functions for Unity to call
        window.UnityToHTML = {
            onPlayerStatsUpdated: (data: string) => {
                this.emit('PlayerStatsUpdated', JSON.parse(data));
            },
            
            onCultivationProgress: (data: string) => {
                this.emit('CultivationProgress', JSON.parse(data));
            },
            
            onCombatStarted: (data: string) => {
                this.emit('CombatStarted', JSON.parse(data));
            },
            
            onCombatEnded: (data: string) => {
                this.emit('CombatEnded', JSON.parse(data));
            },
            
            onInventoryUpdated: (data: string) => {
                this.emit('InventoryUpdated', JSON.parse(data));
            },
            
            onGameStateChanged: (data: string) => {
                this.emit('GameStateChanged', JSON.parse(data));
            },
            
            onError: (message: string) => {
                console.error('Unity Error:', message);
                this.emit('Error', message);
            }
        };
    }
    
    private setupUnityCallbacks(): void {
        // Setup callbacks for Unity events
        if (this.unityInstance && this.unityInstance.Module) {
            console.log('🎮 Unity callbacks setup complete');
        }
    }
    
    sendToUnity(methodName: string, data: string = ''): void {
        if (!this.isReady || !this.unityInstance) {
            console.warn('Unity not ready, queuing message:', methodName, data);
            this.messageQueue.push({ method: methodName, data });
            return;
        }
        
        try {
            this.unityInstance.SendMessage('HybridUIManager', methodName, data);
        } catch (error) {
            console.error('Failed to send message to Unity:', error);
        }
    }
    
    private processMessageQueue(): void {
        while (this.messageQueue.length > 0) {
            const { method, data } = this.messageQueue.shift()!;
            this.sendToUnity(method, data);
        }
    }
    
    // Event system
    on(event: string, callback: EventHandler): void {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event)!.push(callback);
    }
    
    off(event: string, callback: EventHandler): void {
        if (this.eventListeners.has(event)) {
            const listeners = this.eventListeners.get(event)!;
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }
    
    private emit(event: string, data: any): void {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event)!.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Error in event callback:', error);
                }
            });
        }
    }
    
    // Utility methods
    
    getUnityInstance(): UnityInstance | null {
        return this.unityInstance;
    }
    
    // Game-specific methods
    startCultivation(): void {
        this.sendToUnity('StartCultivation');
    }
    
    stopCultivation(): void {
        this.sendToUnity('StopCultivation');
    }
    
    useItem(itemId: string): void {
        this.sendToUnity('UseItem', itemId);
    }
    
    equipItem(itemId: string, slot: string): void {
        this.sendToUnity('EquipItem', JSON.stringify({ itemId, slot }));
    }
    
    startCombat(): void {
        this.sendToUnity('StartCombat');
    }
    
    useCombatTechnique(techniqueId: string): void {
        this.sendToUnity('UseCombatTechnique', techniqueId);
    }
    
    travelToLocation(locationId: string): void {
        this.sendToUnity('TravelToLocation', locationId);
    }
    
    saveGame(): void {
        this.sendToUnity('SaveGame');
    }
    
    loadGame(): void {
        this.sendToUnity('LoadGame');
    }
    
    // Debug methods
    getDebugInfo(): any {
        return {
            isReady: this.isReady,
            unityInstance: !!this.unityInstance,
            queuedMessages: this.messageQueue.length,
            eventListeners: Array.from(this.eventListeners.keys())
        };
    }
}