/**
 * UI Manager
 * Manages UI components and interactions
 */

export class UIManager {
    private components: Map<string, any> = new Map();
    private modals: Map<string, HTMLElement> = new Map();
    private notifications: HTMLElement[] = [];
    private isDebugMode: boolean = false;
    
    constructor() {
        this.setupEventListeners();
    }
    
    async init(): Promise<void> {
        console.log('🎨 Initializing UI Manager...');
        this.createNotificationContainer();
        console.log('✅ UI Manager initialized');
    }
    
    private setupEventListeners(): void {
        // Keyboard shortcuts
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
                return;
            }
            
            switch (event.key) {
                case 'Escape':
                    this.closeAllModals();
                    break;
                case 'F12':
                    event.preventDefault();
                    this.toggleDebugMode();
                    break;
            }
        });
        
        // Click outside to close modals
        document.addEventListener('click', (event: MouseEvent) => {
            this.handleClickOutside(event);
        });
    }
    
    private createNotificationContainer(): void {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    // Modal management
    toggleModal(modalId: string): void {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        if (modal.style.display === 'block') {
            this.hideModal(modalId);
        } else {
            this.showModal(modalId);
        }
    }
    
    showModal(modalId: string): void {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.style.display = 'block';
        this.modals.set(modalId, modal);
        document.body.style.overflow = 'hidden';
    }
    
    hideModal(modalId: string): void {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.style.display = 'none';
        this.modals.delete(modalId);
        
        if (this.modals.size === 0) {
            document.body.style.overflow = 'auto';
        }
    }
    
    closeAllModals(): void {
        this.modals.forEach((modal, modalId) => {
            this.hideModal(modalId);
        });
    }
    
    // Button management
    disableButton(buttonId: string): void {
        const btn = document.getElementById(buttonId) as HTMLButtonElement;
        if (btn) {
            btn.disabled = true;
        }
    }
    
    enableButton(buttonId: string): void {
        const btn = document.getElementById(buttonId) as HTMLButtonElement;
        if (btn) {
            btn.disabled = false;
        }
    }
    
    // Notification system
    showNotification(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', duration: number = 3000): void {
        const notification = this.createNotification(message, type);
        const container = document.getElementById('notification-container');
        
        if (container) {
            container.appendChild(notification);
            this.notifications.push(notification);
            
            // Auto remove after duration
            setTimeout(() => {
                this.hideNotification(notification);
            }, duration);
        }
    }
    
    private createNotification(message: string, type: string): HTMLElement {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideNotification(notification);
            });
        }
        
        return notification;
    }
    
    private hideNotification(notification: HTMLElement): void {
        notification.remove();
        const index = this.notifications.indexOf(notification);
        if (index > -1) {
            this.notifications.splice(index, 1);
        }
    }
    
    // Convenience methods
    showError(message: string): void {
        this.showNotification(message, 'error', 5000);
    }
    
    showSuccess(message: string): void {
        this.showNotification(message, 'success');
    }
    
    showWarning(message: string): void {
        this.showNotification(message, 'warning', 4000);
    }
    
    // Achievement system
    showAchievement(achievement: any): void {
        this.showNotification(`Achievement Unlocked: ${achievement.name}`, 'success', 5000);
        this.addAchievementToUI(achievement);
    }
    
    private addAchievementToUI(achievement: any): void {
        // Add achievement to UI
        console.log('Achievement added to UI:', achievement);
    }
    
    // Debug mode
    toggleDebugMode(): void {
        this.isDebugMode = !this.isDebugMode;
        
        if (this.isDebugMode) {
            this.showDebugPanel();
        } else {
            this.hideDebugPanel();
        }
    }
    
    private showDebugPanel(): void {
        const debugPanel = document.createElement('div');
        debugPanel.id = 'debug-panel';
        debugPanel.className = 'debug-panel';
        debugPanel.innerHTML = `
            <div class="debug-header">
                <h3>Debug Panel</h3>
                <button id="debug-close">&times;</button>
            </div>
            <div class="debug-content">
                <div class="debug-stats">
                    <h4>System Stats</h4>
                    <p>Open Modals: ${this.modals.size}</p>
                    <p>Notifications: ${this.notifications.length}</p>
                    <p>Components: ${this.components.size}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(debugPanel);
        
        // Close button
        const closeBtn = document.getElementById('debug-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideDebugPanel();
            });
        }
    }
    
    private hideDebugPanel(): void {
        const debugPanel = document.getElementById('debug-panel');
        if (debugPanel) {
            debugPanel.remove();
        }
    }
    
    // Component management
    getComponent(name: string): any {
        return this.components.get(name);
    }
    
    registerComponent(name: string, component: any): void {
        this.components.set(name, component);
    }
    
    unregisterComponent(name: string): void {
        this.components.delete(name);
    }
    
    // Event handling
    private handleClickOutside(event: MouseEvent): void {
        this.modals.forEach((modal, modalId) => {
            if (event.target === modal) {
                this.hideModal(modalId);
            }
        });
    }
    
    // UI state management
    showCombatUI(): void {
        console.log('Showing combat UI');
    }
    
    hideCombatUI(): void {
        console.log('Hiding combat UI');
    }
}