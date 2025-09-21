/**
 * Chaos World Game UI Manager
 * Main TypeScript file for game UI functionality
 */

// Import CSS files
import '../css/welcome.css';
import '../css/game.css';
import '../css/password-strength.css';

import { UnityBridge } from './unity-bridge';
import { SteamIntegration } from './steam-integration';
import { UIManager } from './ui/ui-manager';
import { CharacterStats } from './ui/character-stats';
import { CultivationPanel } from './ui/cultivation-panel';
import { InventorySystem } from './ui/inventory-system';
import { CombatUI } from './ui/combat-ui';
import { WelcomeScene } from './ui/welcome-scene';
import { UserProfileComponent } from './ui/user-profile';
import { GameState, PlayerData, UnityEvent, SteamEvent, EventHandler, AuthFormData, UserProfile } from '../types/game-types';
import { apiService } from './services/api-service';

class GameUI {
    private unityBridge: UnityBridge | null = null;
    private steamIntegration: SteamIntegration | null = null;
    private uiManager: UIManager | null = null;
    private characterStats: CharacterStats | null = null;
    private cultivationPanel: CultivationPanel | null = null;
    private inventorySystem: InventorySystem | null = null;
    private combatUI: CombatUI | null = null;
    private welcomeScene: WelcomeScene | null = null;
    private userProfile: UserProfileComponent | null = null;
    
    private isInitialized: boolean = false;
    private isAuthenticated: boolean = false;
    private currentUser: UserProfile | null = null;
    private gameState: GameState;
    
    constructor() {
        this.gameState = this.initializeGameState();
        this.init();
    }
    
    private initializeGameState(): GameState {
        return {
            player: {
                level: 1,
                health: 100,
                maxHealth: 100,
                mana: 50,
                maxMana: 50,
                experience: 0,
                cultivationLevel: 1,
                cultivationProgress: 0,
                currentRealm: 'Qi Refining',
                realmLevel: 1
            },
            game: {
                isPaused: false,
                isInCombat: false,
                currentScene: 'main'
            }
        };
    }
    
    async init(): Promise<void> {
        try {
            console.log('🎮 Initializing Chaos World Game UI...');
            
            // Initialize welcome scene first
            this.welcomeScene = new WelcomeScene();
            
            // Check if user is already authenticated via API service
            if (apiService.isAuthenticated()) {
                try {
                    // Verify token is still valid by fetching current user
                    const response = await apiService.getCurrentUser();
                    if (response.success) {
                        this.currentUser = apiService.convertToUserProfile(response.user);
                        this.isAuthenticated = true;
                        this.showGameUI();
                    } else {
                        // Token is invalid, show welcome scene
                        this.showWelcomeScene();
                    }
                } catch (error) {
                    console.warn('Failed to verify authentication:', error);
                    this.showWelcomeScene();
                }
            } else {
                this.showWelcomeScene();
            }
            
            // Initialize Unity bridge
            this.unityBridge = new UnityBridge();
            await this.unityBridge.init();
            
            // Initialize Steam integration
            this.steamIntegration = new SteamIntegration();
            await this.steamIntegration.init();
            
            // Initialize UI components
            this.uiManager = new UIManager();
            this.characterStats = new CharacterStats(this.gameState.player);
            this.cultivationPanel = new CultivationPanel(this.gameState.player);
            this.inventorySystem = new InventorySystem();
            this.combatUI = new CombatUI();
            this.userProfile = new UserProfileComponent();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize UI
            await this.uiManager.init();
            
            this.isInitialized = true;
            console.log('✅ Game UI initialized successfully');
            
            // Notify Unity that UI is ready
            this.unityBridge?.sendToUnity('UIReady', '');
            
        } catch (error) {
            console.error('❌ Failed to initialize Game UI:', error);
            this.showError('Failed to initialize game UI. Please refresh the page.');
        }
    }
    
    private setupEventListeners(): void {
        // Unity bridge events
        this.unityBridge?.on('PlayerStatsUpdated', (data: PlayerData) => {
            this.updatePlayerStats(data);
        });
        
        this.unityBridge?.on('CultivationProgress', (data: any) => {
            this.updateCultivationProgress(data);
        });
        
        this.unityBridge?.on('CombatStarted', (data: any) => {
            this.startCombat(data);
        });
        
        this.unityBridge?.on('CombatEnded', (data: any) => {
            this.endCombat(data);
        });
        
        this.unityBridge?.on('InventoryUpdated', (data: any) => {
            this.updateInventory(data);
        });
        
        // Steam integration events
        this.steamIntegration?.on('AchievementUnlocked', (achievement: any) => {
            this.showAchievement(achievement);
        });
        
        this.steamIntegration?.on('CloudSaveLoaded', (saveData: any) => {
            this.loadGameData(saveData);
        });
        
        // Window events
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        window.addEventListener('beforeunload', () => {
            this.saveGame();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            this.handleKeyboardShortcuts(event);
        });
        
        // Game UI controls
        const userProfileBtn = document.getElementById('user-profile-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const closeProfileBtn = document.getElementById('close-profile-btn');
        
        userProfileBtn?.addEventListener('click', () => this.showUserProfile());
        logoutBtn?.addEventListener('click', () => this.logout());
        closeProfileBtn?.addEventListener('click', () => this.hideUserProfile());
    }
    
    private updatePlayerStats(data: Partial<PlayerData>): void {
        this.gameState.player = { ...this.gameState.player, ...data };
        this.characterStats?.update(this.gameState.player);
        this.cultivationPanel?.update(this.gameState.player);
    }
    
    private updateCultivationProgress(data: any): void {
        this.gameState.player.cultivationProgress = data.progress;
        this.cultivationPanel?.setProgress(data.progress);
        
        if (data.breakthrough) {
            this.showBreakthroughNotification(data.realm);
            this.steamIntegration?.unlockAchievement('realm_breakthrough');
        }
    }
    
    private startCombat(data: any): void {
        this.gameState.game.isInCombat = true;
        this.combatUI?.show(data);
        this.uiManager?.showCombatUI();
    }
    
    private endCombat(data: any): void {
        this.gameState.game.isInCombat = false;
        this.combatUI?.hide();
        this.uiManager?.hideCombatUI();
        
        if (data.victory) {
            this.showVictoryMessage(data.rewards);
        }
    }
    
    private updateInventory(data: any): void {
        this.inventorySystem?.update(data);
    }
    
    private showAchievement(achievement: any): void {
        this.uiManager?.showAchievement(achievement);
    }
    
    private loadGameData(saveData: any): void {
        this.gameState = { ...this.gameState, ...saveData };
        this.updateAllUI();
    }
    
    private updateAllUI(): void {
        this.characterStats?.update(this.gameState.player);
        this.cultivationPanel?.update(this.gameState.player);
        this.inventorySystem?.update(this.gameState.inventory || { items: [], maxSlots: 0, totalWeight: 0, maxWeight: 0 });
    }
    
    private handleResize(): void {
        // Handle resize - UI manager doesn't have handleResize method
        console.log('Window resized');
    }
    
    private handleKeyboardShortcuts(event: KeyboardEvent): void {
        switch (event.key) {
            case 'i':
                this.inventorySystem?.toggle();
                break;
            case 'c':
                // Toggle cultivation panel - method doesn't exist
                console.log('Toggle cultivation panel');
                break;
            case 'Escape':
                this.uiManager?.closeAllModals();
                break;
            case 'F12':
                this.toggleDebugMode();
                break;
        }
    }
    
    private saveGame(): void {
        if (this.unityBridge && this.unityBridge.isReady) {
            this.unityBridge.sendToUnity('SaveGame', JSON.stringify(this.gameState));
        }
        
        if (this.steamIntegration && this.steamIntegration.isEnabled) {
            this.steamIntegration.saveToCloud(this.gameState);
        }
    }
    
    private showError(message: string): void {
        this.uiManager?.showError(message);
    }
    
    private showBreakthroughNotification(realm: string): void {
        this.uiManager?.showNotification(`Breakthrough! You have reached ${realm}!`, 'success');
    }
    
    private showVictoryMessage(rewards: any): void {
        this.uiManager?.showNotification(`Victory! You gained ${rewards.experience} experience!`, 'success');
    }
    
    private toggleDebugMode(): void {
        this.uiManager?.toggleDebugMode();
    }
    
    // Authentication methods
    private showWelcomeScene(): void {
        this.welcomeScene?.show();
        this.hideGameUI();
    }
    
    private showGameUI(): void {
        this.welcomeScene?.hide();
        this.showGameInterface();
    }
    
    private hideGameUI(): void {
        const gameUI = document.getElementById('game-ui');
        if (gameUI) {
            gameUI.style.display = 'none';
        }
    }
    
    private showGameInterface(): void {
        const gameUI = document.getElementById('game-ui');
        if (gameUI) {
            gameUI.style.display = 'block';
        }
    }
    
    private getSavedUser(): UserProfile | null {
        try {
            const saved = localStorage.getItem('chaos-world-user');
            if (saved) {
                const userData = JSON.parse(saved);
                // Check if the saved data is still valid (e.g., not expired)
                if (userData && userData.id) {
                    return userData;
                }
            }
        } catch (error) {
            console.warn('Failed to load saved user data:', error);
        }
        return null;
    }
    
    private saveUser(user: UserProfile): void {
        try {
            localStorage.setItem('chaos-world-user', JSON.stringify(user));
        } catch (error) {
            console.warn('Failed to save user data:', error);
        }
    }
    
    private clearSavedUser(): void {
        try {
            localStorage.removeItem('chaos-world-user');
        } catch (error) {
            console.warn('Failed to clear user data:', error);
        }
    }
    
    // Method called by welcome scene when user logs in
    onUserLogin(userProfile: UserProfile): void {
        console.log('User logged in:', userProfile.username);
        
        this.currentUser = userProfile;
        this.isAuthenticated = true;
        this.saveUser(userProfile);
        
        // Show game UI
        this.showGameUI();
        
        // Initialize game with user data
        this.initializeGameForUser(userProfile);
    }
    
    private initializeGameForUser(user: UserProfile): void {
        console.log('Initializing game for user:', user.username);
        
        // Update game state with user data
        this.gameState.player.level = user.level;
        
        // Update UI components
        this.updateAllUI();
        
        // Notify Unity about user login
        this.unityBridge?.sendToUnity('UserLogin', JSON.stringify({
            userId: user.id,
            username: user.username,
            level: user.level
        }));
    }
    
    // Public methods for external access
    async logout(): Promise<void> {
        try {
            // Call backend logout API
            await apiService.logout();
        } catch (error) {
            console.warn('Logout API call failed:', error);
        } finally {
            this.currentUser = null;
            this.isAuthenticated = false;
            this.clearSavedUser();
            this.showWelcomeScene();
            
            // Notify Unity about logout
            this.unityBridge?.sendToUnity('UserLogout', '');
        }
    }
    
    getCurrentUser(): UserProfile | null {
        return this.currentUser;
    }
    
    isUserAuthenticated(): boolean {
        return this.isAuthenticated;
    }
    
    // User profile management
    showUserProfile(): void {
        if (this.currentUser && this.userProfile) {
            this.userProfile.show(this.currentUser);
        }
    }
    
    hideUserProfile(): void {
        if (this.userProfile) {
            this.userProfile.hide();
        }
    }
    
    toggleUserProfile(): void {
        if (this.userProfile) {
            this.userProfile.toggle();
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gameUI = new GameUI();
});

// Export for module usage
export { GameUI };
