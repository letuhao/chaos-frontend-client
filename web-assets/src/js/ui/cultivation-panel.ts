/**
 * Cultivation Panel UI Component
 */

import { PlayerData } from '../../types/game-types';

export class CultivationPanel {
    private playerData: PlayerData;
    private isCultivating: boolean = false;
    private cultivationInterval: NodeJS.Timeout | null = null;
    private elements: {
        currentRealm?: HTMLElement;
        realmLevel?: HTMLElement;
        cultivationProgress?: HTMLElement;
        progressText?: HTMLElement;
        cultivateBtn?: HTMLButtonElement;
    } = {};
    private realms: string[] = [
        'Qi Refining', 'Foundation Building', 'Core Formation', 
        'Nascent Soul', 'Spirit Severing', 'Dao Seeking'
    ];
    
    constructor(playerData: PlayerData) {
        this.playerData = { ...playerData };
        this.initializeElements();
        this.setupEventListeners();
    }
    
    private initializeElements(): void {
        this.elements.currentRealm = document.getElementById('current-realm') as HTMLElement | undefined;
        this.elements.realmLevel = document.getElementById('realm-level') as HTMLElement | undefined;
        this.elements.cultivationProgress = document.getElementById('cultivation-progress') as HTMLElement | undefined;
        this.elements.progressText = document.getElementById('progress-text') as HTMLElement | undefined;
        this.elements.cultivateBtn = document.getElementById('cultivate-btn') as HTMLButtonElement | undefined;
    }
    
    private setupEventListeners(): void {
        if (this.elements.cultivateBtn) {
            this.elements.cultivateBtn.addEventListener('click', () => {
                this.toggleCultivation();
            });
        }
    }
    
    update(playerData: PlayerData): void {
        this.playerData = { ...this.playerData, ...playerData };
        this.render();
    }
    
    private render(): void {
        this.updateRealmInfo();
        this.updateProgress();
        this.updateCultivateButton();
    }
    
    private updateRealmInfo(): void {
        if (this.elements.currentRealm) {
            this.elements.currentRealm.textContent = this.playerData.currentRealm || 'Qi Refining';
        }
        
        if (this.elements.realmLevel) {
            this.elements.realmLevel.textContent = `Level ${this.playerData.realmLevel || 1}`;
        }
    }
    
    private updateProgress(): void {
        const progress = this.playerData.cultivationProgress || 0;
        const percentage = Math.min(100, Math.max(0, progress));
        
        if (this.elements.cultivationProgress) {
            this.elements.cultivationProgress.style.width = `${percentage}%`;
        }
        
        if (this.elements.progressText) {
            this.elements.progressText.textContent = `${Math.round(percentage)}%`;
        }
    }
    
    private updateCultivateButton(): void {
        if (!this.elements.cultivateBtn) return;
        
        if (this.isCultivating) {
            this.elements.cultivateBtn.textContent = 'Cultivating...';
            this.elements.cultivateBtn.disabled = true;
            this.elements.cultivateBtn.classList.add('cultivating');
        } else {
            this.elements.cultivateBtn.textContent = 'Cultivate';
            this.elements.cultivateBtn.disabled = false;
            this.elements.cultivateBtn.classList.remove('cultivating');
        }
    }
    
    private toggleCultivation(): void {
        if (this.isCultivating) {
            this.stopCultivation();
        } else {
            this.startCultivation();
        }
    }
    
    private startCultivation(): void {
        if (this.isCultivating) return;
        
        this.isCultivating = true;
        this.updateCultivateButton();
        
        // Start cultivation process
        this.cultivationInterval = setInterval(() => {
            if (this.isCultivating) {
                this.updateCultivationProgress();
            }
        }, 1000);
        
        // Notify Unity
        if (window.gameUI && window.gameUI.unityBridge) {
            window.gameUI.unityBridge.startCultivation();
        }
    }
    
    private stopCultivation(): void {
        if (!this.isCultivating) return;
        
        this.isCultivating = false;
        this.updateCultivateButton();
        
        if (this.cultivationInterval) {
            clearInterval(this.cultivationInterval);
            this.cultivationInterval = null;
        }
        
        // Notify Unity
        if (window.gameUI && window.gameUI.unityBridge) {
            window.gameUI.unityBridge.stopCultivation();
        }
    }
    
    private updateCultivationProgress(): void {
        const currentProgress = this.playerData.cultivationProgress || 0;
        const increment = this.calculateProgressIncrement();
        
        if (currentProgress < 100) {
            this.playerData.cultivationProgress = Math.min(100, currentProgress + increment);
            this.updateProgress();
            
            // Check for breakthrough
            if (this.playerData.cultivationProgress >= 100) {
                this.handleBreakthrough();
            }
        } else {
            this.stopCultivation();
        }
    }
    
    private calculateProgressIncrement(): number {
        const currentRealmIndex = this.realms.indexOf(this.playerData.currentRealm);
        const baseIncrement = 1;
        
        if (currentRealmIndex < this.realms.length - 1) {
            const progressModifier = 1 + (this.playerData.cultivationProgress / 100) * 0.5;
            return baseIncrement * progressModifier;
        }
        
        return baseIncrement;
    }
    
    private handleBreakthrough(): void {
        const currentRealmIndex = this.realms.indexOf(this.playerData.currentRealm);
        
        if (currentRealmIndex < this.realms.length - 1) {
            this.playerData.currentRealm = this.realms[currentRealmIndex + 1];
            this.playerData.realmLevel = 1;
            this.playerData.cultivationProgress = 0;
            
            // Notify Unity
            if (window.gameUI && window.gameUI.unityBridge) {
                window.gameUI.unityBridge.sendToUnity('RealmBreakthrough', this.playerData.currentRealm);
            }
            
            // Show breakthrough notification
            if (window.gameUI && window.gameUI.uiManager) {
                const message = `Breakthrough! You have reached ${this.playerData.currentRealm}!`;
                window.gameUI.uiManager.showSuccess(message);
            }
        } else {
            this.playerData.cultivationProgress = 100;
        }
        
        this.updateRealmInfo();
        this.updateProgress();
    }
    
    setProgress(progress: number): void {
        this.playerData.cultivationProgress = progress;
        this.render();
    }
    
    setRealm(realm: string, level: number): void {
        this.playerData.currentRealm = realm;
        this.playerData.realmLevel = level;
        this.updateRealmInfo();
    }
    
    getCultivationData(): any {
        return {
            currentRealm: this.playerData.currentRealm,
            realmLevel: this.playerData.realmLevel,
            cultivationProgress: this.playerData.cultivationProgress,
            isCultivating: this.isCultivating
        };
    }
    
    resetCultivation(): void {
        this.playerData.cultivationProgress = 0;
        this.updateProgress();
    }
    
    canCultivate(): boolean {
        return !this.isCultivating && this.playerData.cultivationProgress < 100;
    }
    
    getNextRealm(): string | null {
        const realmIndex = this.realms.indexOf(this.playerData.currentRealm);
        if (realmIndex < this.realms.length - 1) {
            return this.realms[realmIndex + 1];
        }
        return null;
    }
}