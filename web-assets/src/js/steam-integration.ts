/**
 * Steam Integration
 * Handles Steam features for the game
 */

import { SteamConfig, SteamEvent, EventHandler } from '../types/game-types';

export class SteamIntegration {
    private config: SteamConfig | null = null;
    public isEnabled: boolean = false;
    private eventListeners: Map<string, EventHandler[]> = new Map();
    
    constructor() {
        this.checkSteamAvailability();
    }
    
    async init(): Promise<void> {
        try {
            console.log('🎮 Initializing Steam Integration...');
            
            // Check if Steam is available
            if (typeof window.Steam !== 'undefined') {
                this.isEnabled = true;
                this.setupSteamCallbacks();
                console.log('✅ Steam Integration initialized');
            } else {
                console.log('⚠️ Steam not available, running in offline mode');
            }
            
        } catch (error) {
            console.error('❌ Failed to initialize Steam Integration:', error);
            throw error;
        }
    }
    
    private checkSteamAvailability(): void {
        // Check if Steam Web API is available
        this.isEnabled = typeof window.Steam !== 'undefined';
    }
    
    private setupSteamCallbacks(): void {
        // Setup Steam callbacks if available
        if (this.isEnabled && window.Steam) {
            // Steam callbacks would be set up here
            console.log('Steam callbacks setup complete');
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
                    console.error('Error in Steam event callback:', error);
                }
            });
        }
    }
    
    // Steam features
    
    unlockAchievement(achievementId: string): void {
        if (!this.isEnabled) {
            console.log('Steam not available, achievement not unlocked:', achievementId);
            return;
        }
        
        console.log('Unlocking achievement:', achievementId);
        
        // Notify Steam
        if (window.Steam && window.Steam.unlockAchievement) {
            window.Steam.unlockAchievement(achievementId);
        }
        
        // Emit event
        this.emit('AchievementUnlocked', { id: achievementId });
    }
    
    saveToCloud(data: any): void {
        if (!this.isEnabled) {
            console.log('Steam not available, saving locally');
            this.saveLocally(data);
            return;
        }
        
        console.log('Saving to Steam Cloud');
        
        // Save to Steam Cloud
        if (window.Steam && window.Steam.saveToCloud) {
            window.Steam.saveToCloud(JSON.stringify(data));
        }
    }
    
    loadFromCloud(): Promise<any> {
        if (!this.isEnabled) {
            console.log('Steam not available, loading locally');
            return this.loadLocally();
        }
        
        return new Promise((resolve, reject) => {
            if (window.Steam && window.Steam.loadFromCloud) {
                window.Steam.loadFromCloud((data: string) => {
                    try {
                        const parsedData = JSON.parse(data);
                        this.emit('CloudSaveLoaded', parsedData);
                        resolve(parsedData);
                    } catch (error) {
                        reject(error);
                    }
                });
            } else {
                reject(new Error('Steam Cloud not available'));
            }
        });
    }
    
    private saveLocally(data: any): void {
        try {
            localStorage.setItem('chaos-world-save', JSON.stringify(data));
            console.log('Game saved locally');
        } catch (error) {
            console.error('Failed to save locally:', error);
        }
    }
    
    private loadLocally(): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const data = localStorage.getItem('chaos-world-save');
                if (data) {
                    const parsedData = JSON.parse(data);
                    resolve(parsedData);
                } else {
                    reject(new Error('No local save found'));
                }
            } catch (error) {
                reject(error);
            }
        });
    }
    
    // Steam overlay
    showOverlay(): void {
        if (!this.isEnabled) return;
        
        if (window.Steam && window.Steam.showOverlay) {
            window.Steam.showOverlay();
        }
    }
    
    hideOverlay(): void {
        if (!this.isEnabled) return;
        
        if (window.Steam && window.Steam.hideOverlay) {
            window.Steam.hideOverlay();
        }
    }
    
    // Steam friends
    getFriends(): Promise<any[]> {
        if (!this.isEnabled) {
            return Promise.resolve([]);
        }
        
        return new Promise((resolve) => {
            if (window.Steam && window.Steam.getFriends) {
                window.Steam.getFriends((friends: any[]) => {
                    resolve(friends);
                });
            } else {
                resolve([]);
            }
        });
    }
    
    // Steam stats
    setStat(statName: string, value: number): void {
        if (!this.isEnabled) return;
        
        if (window.Steam && window.Steam.setStat) {
            window.Steam.setStat(statName, value);
        }
    }
    
    getStat(statName: string): Promise<number> {
        if (!this.isEnabled) {
            return Promise.resolve(0);
        }
        
        return new Promise((resolve) => {
            if (window.Steam && window.Steam.getStat) {
                window.Steam.getStat(statName, (value: number) => {
                    resolve(value);
                });
            } else {
                resolve(0);
            }
        });
    }
    
    // Debug methods
    getDebugInfo(): any {
        return {
            isEnabled: this.isEnabled,
            steamAvailable: typeof window.Steam !== 'undefined',
            eventListeners: Array.from(this.eventListeners.keys())
        };
    }
}

// Declare Steam global interface
declare global {
    interface Window {
        Steam: {
            unlockAchievement: (id: string) => void;
            saveToCloud: (data: string) => void;
            loadFromCloud: (callback: (data: string) => void) => void;
            showOverlay: () => void;
            hideOverlay: () => void;
            getFriends: (callback: (friends: any[]) => void) => void;
            setStat: (name: string, value: number) => void;
            getStat: (name: string, callback: (value: number) => void) => void;
        };
    }
}