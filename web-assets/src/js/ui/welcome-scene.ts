/**
 * Welcome Scene UI Component
 * Handles the welcome/login/register scene
 */

import { AuthFormData, AuthMode, LoginRequest, RegisterRequest } from '../../types/game-types';
import { apiService } from '../services/api-service';
import { PasswordStrengthIndicator } from '../password-strength';

export class WelcomeScene {
    private elements: {
        container?: HTMLElement;
        welcomeModal?: HTMLElement;
        loginForm?: HTMLElement;
        registerForm?: HTMLElement;
        modeToggle?: HTMLElement;
        background?: HTMLElement;
    } = {};
    
    private currentMode: AuthMode = 'welcome';
    private isVisible: boolean = false;
    private passwordStrengthIndicator?: PasswordStrengthIndicator;
    
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.render();
    }
    
    private initializeElements(): void {
        this.elements.container = document.getElementById('welcome-scene') as HTMLElement | undefined;
        this.elements.welcomeModal = document.getElementById('welcome-modal') as HTMLElement | undefined;
        this.elements.loginForm = document.getElementById('login-form') as HTMLElement | undefined;
        this.elements.registerForm = document.getElementById('register-form') as HTMLElement | undefined;
        this.elements.modeToggle = document.getElementById('auth-mode-toggle') as HTMLElement | undefined;
        this.elements.background = document.getElementById('welcome-background') as HTMLElement | undefined;
        
        // Initialize password strength indicator
        this.initializePasswordStrengthIndicator();
    }
    
    private initializePasswordStrengthIndicator(): void {
        const passwordInput = document.getElementById('register-password') as HTMLInputElement;
        const strengthContainer = document.getElementById('password-strength-container') as HTMLElement;
        
        if (passwordInput && strengthContainer) {
            this.passwordStrengthIndicator = new PasswordStrengthIndicator(
                passwordInput, 
                strengthContainer
            );
            
            // Show/hide indicator on focus/blur
            passwordInput.addEventListener('focus', () => {
                strengthContainer.classList.remove('hidden');
            });
            
            passwordInput.addEventListener('blur', () => {
                if (!passwordInput.value) {
                    strengthContainer.classList.add('hidden');
                }
            });
        }
    }
    
    private setupEventListeners(): void {
        // Use event delegation for better reliability
        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            
            // Mode toggle buttons
            if (target.id === 'show-login-btn') {
                e.preventDefault();
                this.setMode('login');
            } else if (target.id === 'show-register-btn') {
                e.preventDefault();
                this.setMode('register');
            } else if (target.id === 'guest-play-btn') {
                e.preventDefault();
                this.handleGuestLogin();
            } else if (target.id === 'back-to-welcome-login' || target.id === 'back-to-welcome-register') {
                e.preventDefault();
                console.log('Back button clicked, returning to welcome screen');
                this.setMode('welcome');
            }
        });
        
        // Form submissions
        const loginForm = document.getElementById('login-form') as HTMLFormElement;
        const registerForm = document.getElementById('register-form') as HTMLFormElement;
        
        loginForm?.addEventListener('submit', (e) => this.handleLoginSubmit(e));
        registerForm?.addEventListener('submit', (e) => this.handleRegisterSubmit(e));
        
        // Social login buttons
        this.setupSocialLoginButtons();
        
        // Background click to close
        this.elements.background?.addEventListener('click', () => {
            if (this.currentMode !== 'welcome') {
                this.setMode('welcome');
            }
        });
        
        // Escape key to go back
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                if (this.currentMode !== 'welcome') {
                    this.setMode('welcome');
                } else {
                    this.hide();
                }
            }
        });
    }
    
    show(): void {
        this.isVisible = true;
        if (this.elements.container) {
            this.elements.container.classList.add('show');
        }
        this.setMode('welcome');
    }
    
    hide(): void {
        this.isVisible = false;
        if (this.elements.container) {
            this.elements.container.classList.remove('show');
        }
    }
    
    toggle(): void {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    private setMode(mode: AuthMode): void {
        this.currentMode = mode;
        this.render();
    }
    
    private render(): void {
        if (!this.elements.container) return;
        
        // Update visibility of different sections
        this.updateSectionVisibility('welcome', this.currentMode === 'welcome');
        this.updateSectionVisibility('login', this.currentMode === 'login');
        this.updateSectionVisibility('register', this.currentMode === 'register');
        
        // Update mode toggle text
        if (this.elements.modeToggle) {
            if (this.currentMode === 'login') {
                this.elements.modeToggle.innerHTML = `
                    <p>Don't have an account? <a href="#" id="show-register-link">Register here</a></p>
                `;
            } else if (this.currentMode === 'register') {
                this.elements.modeToggle.innerHTML = `
                    <p>Already have an account? <a href="#" id="show-login-link">Login here</a></p>
                `;
            } else {
                this.elements.modeToggle.innerHTML = '';
            }
        }
        
        // Re-setup event listeners for dynamically created links
        this.setupModeToggleLinks();
        
        // Ensure back buttons work by re-attaching listeners
        this.setupBackButtons();
        
    }
    
    private updateSectionVisibility(sectionId: string, visible: boolean): void {
        const section = document.getElementById(`${sectionId}-section`);
        if (section) {
            section.style.display = visible ? 'block' : 'none';
        }
    }
    
    private setupModeToggleLinks(): void {
        const showRegisterLink = document.getElementById('show-register-link');
        const showLoginLink = document.getElementById('show-login-link');
        
        showRegisterLink?.addEventListener('click', (e) => {
            e.preventDefault();
            this.setMode('register');
        });
        
        showLoginLink?.addEventListener('click', (e) => {
            e.preventDefault();
            this.setMode('login');
        });
    }
    
    private setupBackButtons(): void {
        const backToWelcomeLoginBtn = document.getElementById('back-to-welcome-login');
        const backToWelcomeRegisterBtn = document.getElementById('back-to-welcome-register');
        
        // Remove existing listeners to avoid duplicates
        backToWelcomeLoginBtn?.removeEventListener('click', this.handleBackToWelcome);
        backToWelcomeRegisterBtn?.removeEventListener('click', this.handleBackToWelcome);
        
        // Add new listeners
        backToWelcomeLoginBtn?.addEventListener('click', this.handleBackToWelcome);
        backToWelcomeRegisterBtn?.addEventListener('click', this.handleBackToWelcome);
    }
    
    private handleBackToWelcome = (e: Event): void => {
        e.preventDefault();
        console.log('Back button clicked, returning to welcome screen');
        this.setMode('welcome');
    }
    
    
    private setupSocialLoginButtons(): void {
        // Login social buttons
        const googleLoginBtn = document.getElementById('google-login-btn');
        const steamLoginBtn = document.getElementById('steam-login-btn');
        const discordLoginBtn = document.getElementById('discord-login-btn');
        
        // Register social buttons
        const googleRegisterBtn = document.getElementById('google-register-btn');
        const steamRegisterBtn = document.getElementById('steam-register-btn');
        const discordRegisterBtn = document.getElementById('discord-register-btn');
        
        // Login social buttons
        googleLoginBtn?.addEventListener('click', () => this.handleSocialLogin('google'));
        steamLoginBtn?.addEventListener('click', () => this.handleSocialLogin('steam'));
        discordLoginBtn?.addEventListener('click', () => this.handleSocialLogin('discord'));
        
        // Register social buttons
        googleRegisterBtn?.addEventListener('click', () => this.handleSocialRegister('google'));
        steamRegisterBtn?.addEventListener('click', () => this.handleSocialRegister('steam'));
        discordRegisterBtn?.addEventListener('click', () => this.handleSocialRegister('discord'));
    }
    
    private handleGuestLogin(): void {
        console.log('Guest login requested');
        this.showMessage('Entering as guest...', 'info');
        
        // Simulate guest login
        setTimeout(() => {
            const guestData: AuthFormData = {
                username: 'Guest',
                password: '',
                email: 'guest@chaosworld.com',
                rememberMe: false,
                isGuest: true
            };
            
            this.showMessage('Welcome, Guest!', 'success');
            this.hide();
            
            // Notify game UI that guest is logged in
            if (window.gameUI) {
                window.gameUI.onUserLogin(guestData);
            }
        }, 1000);
    }
    
    private handleSocialLogin(provider: 'google' | 'steam' | 'discord'): void {
        console.log(`${provider} login requested`);
        this.showMessage(`Connecting to ${provider}...`, 'info');
        
        // Simulate social login
        setTimeout(() => {
            const socialData: AuthFormData = {
                username: `${provider}_user_${Math.random().toString(36).substr(2, 9)}`,
                password: '',
                email: `${provider}_user@chaosworld.com`,
                rememberMe: true,
                socialProvider: provider
            };
            
            this.showMessage(`Successfully logged in with ${provider}!`, 'success');
            this.hide();
            
            // Notify game UI that user is logged in
            if (window.gameUI) {
                window.gameUI.onUserLogin(socialData);
            }
        }, 2000);
    }
    
    private handleSocialRegister(provider: 'google' | 'steam' | 'discord'): void {
        console.log(`${provider} registration requested`);
        this.showMessage(`Creating account with ${provider}...`, 'info');
        
        // Simulate social registration
        setTimeout(() => {
            const socialData: AuthFormData = {
                username: `${provider}_user_${Math.random().toString(36).substr(2, 9)}`,
                password: '',
                email: `${provider}_user@chaosworld.com`,
                rememberMe: true,
                socialProvider: provider
            };
            
            this.showMessage(`Account created with ${provider}! Welcome to Chaos World!`, 'success');
            this.hide();
            
            // Notify game UI that user is registered and logged in
            if (window.gameUI) {
                window.gameUI.onUserLogin(socialData);
            }
        }, 2500);
    }
    
    private handleLoginSubmit(event: Event): void {
        event.preventDefault();
        
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        
        const authData: AuthFormData = {
            username: formData.get('username') as string,
            password: formData.get('password') as string,
            email: formData.get('email') as string || '',
            rememberMe: formData.get('rememberMe') === 'on'
        };
        
        this.performLogin(authData);
    }
    
    private handleRegisterSubmit(event: Event): void {
        event.preventDefault();
        
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        
        const authData: AuthFormData = {
            username: formData.get('username') as string,
            password: formData.get('password') as string,
            confirmPassword: formData.get('confirmPassword') as string,
            email: formData.get('email') as string,
            displayName: formData.get('displayName') as string,
            agreeToTerms: formData.get('agreeToTerms') === 'on'
        };
        
        this.performRegister(authData);
    }
    
    private async performLogin(authData: AuthFormData): Promise<void> {
        console.log('Attempting login:', authData.username);
        
        // Show loading state
        this.setFormLoading('login', true);
        
        try {
            // Convert to backend format
            const loginRequest: LoginRequest = {
                username: authData.username,
                password: authData.password,
                rememberMe: authData.rememberMe
            };

            // Call backend API
            const response = await apiService.login(loginRequest);
            
            if (response.success) {
                this.setFormLoading('login', false);
                this.showMessage('Login successful!', 'success');
                this.hide();
                
                // Convert backend user to frontend format
                const userProfile = apiService.convertToUserProfile(response.user);
                
                // Notify game UI that user is logged in
                if (window.gameUI) {
                    window.gameUI.onUserLogin(userProfile);
                }
            } else {
                this.setFormLoading('login', false);
                this.showMessage('Login failed. Please check your credentials.', 'error');
            }
        } catch (error: any) {
            this.setFormLoading('login', false);
            this.showMessage(error.message || 'Login failed. Please try again.', 'error');
            console.error('Login error:', error);
        }
    }
    
    private async performRegister(authData: AuthFormData): Promise<void> {
        console.log('Attempting registration:', authData.username);
        
        // Validate password strength
        if (this.passwordStrengthIndicator) {
            const passwordValidation = this.passwordStrengthIndicator.getValidationResult();
            if (!passwordValidation.isValid) {
                this.showMessage('Password does not meet requirements:\n' + passwordValidation.errors.join('\n'), 'error');
                return;
            }
        }
        
        // Validate passwords match
        if (authData.password !== authData.confirmPassword) {
            this.showMessage('Passwords do not match', 'error');
            return;
        }
        
        // Validate required fields
        if (!authData.email || !authData.agreeToTerms) {
            this.showMessage('Please fill in all required fields and agree to terms', 'error');
            return;
        }
        
        // Show loading state
        this.setFormLoading('register', true);
        
        try {
            // Convert to backend format
            const registerRequest: RegisterRequest = {
                username: authData.username,
                email: authData.email,
                password: authData.password,
                confirmPassword: authData.confirmPassword!,
                displayName: authData.displayName || authData.username,
                agreeToTerms: authData.agreeToTerms!
            };

            // Call backend API
            const response = await apiService.register(registerRequest);
            
            if (response.success) {
                this.setFormLoading('register', false);
                this.showMessage('Registration successful! You are now logged in.', 'success');
                this.hide();
                
                // Convert backend user to frontend format
                const userProfile = apiService.convertToUserProfile(response.user);
                
                // Notify game UI that user is logged in
                if (window.gameUI) {
                    window.gameUI.onUserLogin(userProfile);
                }
            } else {
                this.setFormLoading('register', false);
                this.showMessage('Registration failed. Please try again.', 'error');
            }
        } catch (error: any) {
            this.setFormLoading('register', false);
            this.showMessage(error.message || 'Registration failed. Please try again.', 'error');
            console.error('Registration error:', error);
        }
    }
    
    private setFormLoading(formType: 'login' | 'register', loading: boolean): void {
        const form = document.getElementById(`${formType}-form`) as HTMLFormElement;
        const submitBtn = form?.querySelector('button[type="submit"]') as HTMLButtonElement;
        
        if (submitBtn) {
            submitBtn.disabled = loading;
            submitBtn.textContent = loading ? 'Please wait...' : (formType === 'login' ? 'Login' : 'Register');
        }
    }
    
    private showMessage(message: string, type: 'success' | 'error' | 'info'): void {
        // Create or update message element
        let messageEl = document.getElementById('auth-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'auth-message';
            messageEl.className = 'auth-message';
            this.elements.container?.appendChild(messageEl);
        }
        
        messageEl.textContent = message;
        messageEl.className = `auth-message ${type}`;
        messageEl.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageEl!.style.display = 'none';
        }, 5000);
    }
    
    // Public methods for external control
    getCurrentMode(): AuthMode {
        return this.currentMode;
    }
    
    isWelcomeVisible(): boolean {
        return this.isVisible;
    }
    
    // Method to be called when user successfully logs in
    onUserLogin(authData: AuthFormData): void {
        console.log('User logged in:', authData.username);
        // This will be implemented by the main game UI
    }
}
