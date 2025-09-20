/**
 * Combat UI Component
 */

import { CombatData } from '../../types/game-types';

export class CombatUI {
    private combatData: CombatData | null = null;
    private elements: {
        modal?: HTMLElement;
        playerHealth?: HTMLElement;
        enemyHealth?: HTMLElement;
        techniques?: HTMLElement;
        items?: HTMLElement;
    } = {};
    
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
    }
    
    private initializeElements(): void {
        this.elements.modal = document.getElementById('combat-modal') as HTMLElement | undefined;
        this.elements.playerHealth = document.getElementById('player-health-bar') as HTMLElement | undefined;
        this.elements.enemyHealth = document.getElementById('enemy-health-bar') as HTMLElement | undefined;
        this.elements.techniques = document.getElementById('combat-techniques') as HTMLElement | undefined;
        this.elements.items = document.getElementById('combat-items') as HTMLElement | undefined;
    }
    
    private setupEventListeners(): void {
        // Combat techniques
        if (this.elements.techniques) {
            this.elements.techniques.addEventListener('click', (event: MouseEvent) => {
                const target = event.target as HTMLElement;
                if (target.classList.contains('technique-btn')) {
                    const techniqueId = target.dataset.techniqueId;
                    if (techniqueId) {
                        this.useTechnique(techniqueId);
                    }
                }
            });
        }
        
        // Combat items
        if (this.elements.items) {
            this.elements.items.addEventListener('click', (event: MouseEvent) => {
                const target = event.target as HTMLElement;
                if (target.classList.contains('item-btn')) {
                    const itemId = target.dataset.itemId;
                    if (itemId) {
                        this.useItem(itemId);
                    }
                }
            });
        }
    }
    
    show(combatData: CombatData): void {
        this.combatData = combatData;
        this.render();
        
        if (this.elements.modal) {
            this.elements.modal.style.display = 'block';
        }
    }
    
    hide(): void {
        if (this.elements.modal) {
            this.elements.modal.style.display = 'none';
        }
        this.combatData = null;
    }
    
    update(combatData: CombatData): void {
        this.combatData = combatData;
        this.render();
    }
    
    private render(): void {
        if (!this.combatData) return;
        
        this.renderPlayerHealth();
        this.renderEnemyHealth();
        this.renderTechniques();
        this.renderItems();
    }
    
    private renderPlayerHealth(): void {
        if (!this.elements.playerHealth || !this.combatData) return;
        
        const { player } = this.combatData;
        const healthPercentage = (player.health || 0) / (player.maxHealth || 1) * 100;
        
        this.elements.playerHealth.innerHTML = `
            <div class="health-bar">
                <div class="health-fill" style="width: ${healthPercentage}%"></div>
                <span class="health-text">${player.health || 0}/${player.maxHealth || 0}</span>
            </div>
        `;
    }
    
    private renderEnemyHealth(): void {
        if (!this.elements.enemyHealth || !this.combatData) return;
        
        const { enemy } = this.combatData;
        const healthPercentage = enemy.health / enemy.maxHealth * 100;
        
        this.elements.enemyHealth.innerHTML = `
            <div class="health-bar">
                <div class="health-fill" style="width: ${healthPercentage}%"></div>
                <span class="health-text">${enemy.health}/${enemy.maxHealth}</span>
            </div>
        `;
    }
    
    private renderTechniques(): void {
        if (!this.elements.techniques || !this.combatData) return;
        
        const techniques = this.combatData.techniques || [];
        
        this.elements.techniques.innerHTML = techniques.map(technique => `
            <button class="technique-btn" data-technique-id="${technique.id}">
                <div class="technique-name">${technique.name}</div>
                <div class="technique-cost">${technique.manaCost} MP</div>
            </button>
        `).join('');
    }
    
    private renderItems(): void {
        if (!this.elements.items || !this.combatData) return;
        
        const items = this.combatData.items || [];
        
        this.elements.items.innerHTML = items.map(item => `
            <button class="item-btn" data-item-id="${item.id}">
                <div class="item-name">${item.name}</div>
                <div class="item-quantity">x${item.quantity}</div>
            </button>
        `).join('');
    }
    
    private useTechnique(techniqueId: string): void {
        console.log('Using technique:', techniqueId);
        
        // Notify Unity
        if (window.gameUI && window.gameUI.unityBridge) {
            window.gameUI.unityBridge.useCombatTechnique(techniqueId);
        }
    }
    
    private useItem(itemId: string): void {
        console.log('Using combat item:', itemId);
        
        // Notify Unity
        if (window.gameUI && window.gameUI.unityBridge) {
            window.gameUI.unityBridge.useItem(itemId);
        }
    }
    
    showCombatMessage(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info'): void {
        if (window.gameUI && window.gameUI.uiManager) {
            window.gameUI.uiManager.showNotification(message, type);
        }
    }
    
    updateCombatStatus(status: string): void {
        console.log('Combat status:', status);
        // Update UI based on combat status
    }
}