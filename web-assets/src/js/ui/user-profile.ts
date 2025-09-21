/**
 * User Profile UI Component
 * Handles user profile display and management
 */

import { UserProfile } from '../../types/game-types';
import { apiService } from '../services/api-service';

export class UserProfileComponent {
    private elements: {
        container?: HTMLElement;
        profileModal?: HTMLElement;
        userInfo?: HTMLElement;
        logoutBtn?: HTMLElement;
        refreshBtn?: HTMLElement;
    } = {};
    
    private currentUser: UserProfile | null = null;
    private isVisible: boolean = false;
    
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
    }
    
    private initializeElements(): void {
        this.elements.container = document.getElementById('user-profile') as HTMLElement | undefined;
        this.elements.profileModal = document.getElementById('profile-modal') as HTMLElement | undefined;
        this.elements.userInfo = document.getElementById('user-info') as HTMLElement | undefined;
        this.elements.logoutBtn = document.getElementById('logout-btn') as HTMLElement | undefined;
        this.elements.refreshBtn = document.getElementById('refresh-profile-btn') as HTMLElement | undefined;
    }
    
    private setupEventListeners(): void {
        // Logout button
        this.elements.logoutBtn?.addEventListener('click', () => this.handleLogout());
        
        // Refresh profile button
        this.elements.refreshBtn?.addEventListener('click', () => this.refreshProfile());
        
        // Close modal on background click
        this.elements.profileModal?.addEventListener('click', (e) => {
            if (e.target === this.elements.profileModal) {
                this.hide();
            }
        });
        
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
    }
    
    show(user: UserProfile): void {
        this.currentUser = user;
        this.isVisible = true;
        this.render();
        
        if (this.elements.container) {
            this.elements.container.style.display = 'block';
        }
    }
    
    hide(): void {
        this.isVisible = false;
        if (this.elements.container) {
            this.elements.container.style.display = 'none';
        }
    }
    
    toggle(): void {
        if (this.isVisible) {
            this.hide();
        } else if (this.currentUser) {
            this.show(this.currentUser);
        }
    }
    
    private render(): void {
        if (!this.currentUser || !this.elements.userInfo) return;
        
        const user = this.currentUser;
        const joinDate = user.joinDate.toLocaleDateString();
        const lastLogin = user.lastLogin ? user.lastLogin.toLocaleDateString() : 'Never';
        
        this.elements.userInfo.innerHTML = `
            <div class="profile-header">
                <div class="profile-avatar">
                    ${user.avatar ? 
                        `<img src="${user.avatar}" alt="${user.displayName}" class="avatar-image">` : 
                        `<div class="avatar-placeholder">${user.displayName.charAt(0).toUpperCase()}</div>`
                    }
                </div>
                <div class="profile-info">
                    <h3 class="profile-name">${user.displayName}</h3>
                    <p class="profile-username">@${user.username}</p>
                    <p class="profile-email">${user.email}</p>
                </div>
            </div>
            
            <div class="profile-details">
                <div class="detail-item">
                    <span class="detail-label">Level:</span>
                    <span class="detail-value">${user.level}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Joined:</span>
                    <span class="detail-value">${joinDate}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Last Login:</span>
                    <span class="detail-value">${lastLogin}</span>
                </div>
            </div>
            
            <div class="profile-actions">
                <button id="refresh-profile-btn" class="btn btn-secondary">
                    <i class="icon-refresh"></i> Refresh Profile
                </button>
                <button id="logout-btn" class="btn btn-danger">
                    <i class="icon-logout"></i> Logout
                </button>
            </div>
        `;
        
        // Re-setup event listeners for dynamically created buttons
        this.setupEventListeners();
    }
    
    private async refreshProfile(): Promise<void> {
        if (!this.elements.refreshBtn) return;
        
        // Show loading state
        const originalText = this.elements.refreshBtn.textContent;
        this.elements.refreshBtn.textContent = 'Refreshing...';
        this.elements.refreshBtn.setAttribute('disabled', 'true');
        
        try {
            // Fetch fresh user data from backend
            const response = await apiService.getCurrentUser();
            
            if (response.success) {
                this.currentUser = apiService.convertToUserProfile(response.user);
                this.render();
                this.showMessage('Profile refreshed successfully!', 'success');
            } else {
                this.showMessage('Failed to refresh profile', 'error');
            }
        } catch (error: any) {
            this.showMessage(error.message || 'Failed to refresh profile', 'error');
            console.error('Profile refresh error:', error);
        } finally {
            // Restore button state
            this.elements.refreshBtn.textContent = originalText;
            this.elements.refreshBtn.removeAttribute('disabled');
        }
    }
    
    private async handleLogout(): Promise<void> {
        try {
            // Call game UI logout method
            if (window.gameUI) {
                await window.gameUI.logout();
            }
            this.hide();
        } catch (error) {
            console.error('Logout error:', error);
            this.showMessage('Logout failed', 'error');
        }
    }
    
    private showMessage(message: string, type: 'success' | 'error' | 'info'): void {
        // Create or update message element
        let messageEl = document.getElementById('profile-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'profile-message';
            messageEl.className = 'profile-message';
            this.elements.container?.appendChild(messageEl);
        }
        
        messageEl.textContent = message;
        messageEl.className = `profile-message ${type}`;
        messageEl.style.display = 'block';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            messageEl!.style.display = 'none';
        }, 3000);
    }
    
    // Public methods
    updateUser(user: UserProfile): void {
        this.currentUser = user;
        if (this.isVisible) {
            this.render();
        }
    }
    
    getCurrentUser(): UserProfile | null {
        return this.currentUser;
    }
    
    isProfileVisible(): boolean {
        return this.isVisible;
    }
}

// Export for global access
declare global {
    interface Window {
        userProfile: UserProfileComponent;
    }
}

// Create singleton instance
export const userProfile = new UserProfileComponent();

// Make available globally
if (typeof window !== 'undefined') {
    window.userProfile = userProfile;
}
