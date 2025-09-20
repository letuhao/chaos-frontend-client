/**
 * Character Stats UI Component
 */

import { PlayerData } from '../../types/game-types';

export class CharacterStats {
    private playerData: PlayerData;
    private elements: {
        level?: HTMLElement;
        health?: HTMLElement;
        mana?: HTMLElement;
        experience?: HTMLElement;
        cultivationLevel?: HTMLElement;
    } = {};
    
    constructor(playerData: PlayerData) {
        this.playerData = { ...playerData };
        this.initializeElements();
    }
    
    private initializeElements(): void {
        this.elements.level = document.getElementById('player-level') as HTMLElement | undefined;
        this.elements.health = document.getElementById('player-health') as HTMLElement | undefined;
        this.elements.mana = document.getElementById('player-mana') as HTMLElement | undefined;
        this.elements.experience = document.getElementById('player-experience') as HTMLElement | undefined;
        this.elements.cultivationLevel = document.getElementById('cultivation-level') as HTMLElement | undefined;
    }
    
    update(playerData: PlayerData): void {
        this.playerData = { ...this.playerData, ...playerData };
        this.render();
    }
    
    private render(): void {
        this.updateLevel();
        this.updateHealth();
        this.updateMana();
        this.updateExperience();
        this.updateCultivationLevel();
    }
    
    private updateLevel(): void {
        if (this.elements.level) {
            this.elements.level.textContent = this.playerData.level.toString();
        }
    }
    
    private updateHealth(): void {
        if (this.elements.health) {
            this.elements.health.textContent = `${this.playerData.health}/${this.playerData.maxHealth}`;
        }
    }
    
    private updateMana(): void {
        if (this.elements.mana) {
            this.elements.mana.textContent = `${this.playerData.mana}/${this.playerData.maxMana}`;
        }
    }
    
    private updateExperience(): void {
        if (this.elements.experience) {
            this.elements.experience.textContent = this.playerData.experience.toString();
        }
    }
    
    private updateCultivationLevel(): void {
        if (this.elements.cultivationLevel) {
            this.elements.cultivationLevel.textContent = this.playerData.cultivationLevel.toString();
        }
    }
}