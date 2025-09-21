/**
 * API Service
 * Handles communication with the Chaos World backend services
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AuthFormData, UserProfile, ApiResponse } from '../../types/game-types';

// API Response types for user-management service
export interface LoginRequest {
    username: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    displayName: string;
    agreeToTerms: boolean;
}

export interface AuthResponse {
    success: boolean;
    user: {
        id: string;
        username: string;
        email: string;
        display_name: string;
        avatar_url?: string;
        status: string;
        email_verified: boolean;
        created_at: string;
        updated_at: string;
        last_login?: string;
    };
    tokens: {
        access_token: string;
        refresh_token: string;
        expires_in: number;
    };
}

export interface UserProfileResponse {
    success: boolean;
    user: {
        id: string;
        username: string;
        email: string;
        display_name: string;
        avatar_url?: string;
        status: string;
        email_verified: boolean;
        created_at: string;
        updated_at: string;
        last_login?: string;
    };
}

export interface ErrorResponse {
    success: false;
    error: string;
    details?: string;
}

export class ApiService {
    private api: AxiosInstance;
    private baseURL: string;
    private accessToken: string | null = null;
    private refreshToken: string | null = null;

    constructor() {
        // Get base URL from environment or use default
        this.baseURL = (typeof process !== 'undefined' && process.env?.USER_MANAGEMENT_URL) || 'http://localhost:8080';
        
        this.api = axios.create({
            baseURL: this.baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Load tokens from localStorage
        this.loadTokens();

        // Setup request interceptor to add auth token
        this.api.interceptors.request.use(
            (config) => {
                if (this.accessToken) {
                    config.headers.Authorization = `Bearer ${this.accessToken}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Setup response interceptor to handle token refresh
        this.api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        await this.refreshAccessToken();
                        originalRequest.headers.Authorization = `Bearer ${this.accessToken}`;
                        return this.api(originalRequest);
                    } catch (refreshError) {
                        this.clearTokens();
                        this.redirectToLogin();
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    // Token management
    private loadTokens(): void {
        try {
            this.accessToken = localStorage.getItem('chaos-world-access-token');
            this.refreshToken = localStorage.getItem('chaos-world-refresh-token');
        } catch (error) {
            console.warn('Failed to load tokens from localStorage:', error);
        }
    }

    private saveTokens(accessToken: string, refreshToken: string): void {
        try {
            localStorage.setItem('chaos-world-access-token', accessToken);
            localStorage.setItem('chaos-world-refresh-token', refreshToken);
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
        } catch (error) {
            console.warn('Failed to save tokens to localStorage:', error);
        }
    }

    private clearTokens(): void {
        try {
            localStorage.removeItem('chaos-world-access-token');
            localStorage.removeItem('chaos-world-refresh-token');
            this.accessToken = null;
            this.refreshToken = null;
        } catch (error) {
            console.warn('Failed to clear tokens from localStorage:', error);
        }
    }

    private redirectToLogin(): void {
        // This will be handled by the main game UI
        if (window.gameUI) {
            window.gameUI.logout();
        }
    }

    // Authentication methods
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        try {
            const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', credentials);
            
            if (response.data.success && response.data.tokens) {
                this.saveTokens(response.data.tokens.access_token, response.data.tokens.refresh_token);
            }
            
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    async register(userData: RegisterRequest): Promise<AuthResponse> {
        try {
            const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', userData);
            
            if (response.data.success && response.data.tokens) {
                this.saveTokens(response.data.tokens.access_token, response.data.tokens.refresh_token);
            }
            
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    async getCurrentUser(): Promise<UserProfileResponse> {
        try {
            const response: AxiosResponse<UserProfileResponse> = await this.api.get('/auth/me');
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    async refreshAccessToken(): Promise<void> {
        if (!this.refreshToken) {
            throw new Error('No refresh token available');
        }

        try {
            const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/refresh', {
                refresh_token: this.refreshToken
            });
            
            if (response.data.success && response.data.tokens) {
                this.saveTokens(response.data.tokens.access_token, response.data.tokens.refresh_token);
            } else {
                throw new Error('Failed to refresh token');
            }
        } catch (error: any) {
            this.clearTokens();
            throw this.handleError(error);
        }
    }

    async logout(): Promise<void> {
        try {
            if (this.accessToken) {
                await this.api.post('/auth/logout');
            }
        } catch (error: any) {
            console.warn('Logout request failed:', error);
        } finally {
            this.clearTokens();
        }
    }

    async logoutAll(): Promise<void> {
        try {
            if (this.accessToken) {
                await this.api.post('/auth/logout-all');
            }
        } catch (error: any) {
            console.warn('Logout all request failed:', error);
        } finally {
            this.clearTokens();
        }
    }

    // Health check
    async healthCheck(): Promise<boolean> {
        try {
            const response = await this.api.get('/health');
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }

    // Utility methods
    isAuthenticated(): boolean {
        return !!this.accessToken;
    }

    getAccessToken(): string | null {
        return this.accessToken;
    }

    getRefreshToken(): string | null {
        return this.refreshToken;
    }

    // Convert backend user data to frontend UserProfile
    convertToUserProfile(backendUser: any): UserProfile {
        return {
            id: backendUser.id,
            username: backendUser.username,
            email: backendUser.email,
            displayName: backendUser.display_name,
            avatar: backendUser.avatar_url,
            level: 1, // Default level, could be fetched from game service
            joinDate: new Date(backendUser.created_at),
            lastLogin: backendUser.last_login ? new Date(backendUser.last_login) : undefined
        };
    }

    // Error handling
    private handleError(error: any): Error {
        if (error.response?.data) {
            const errorData = error.response.data as ErrorResponse;
            return new Error(errorData.details || errorData.error || 'An error occurred');
        } else if (error.request) {
            return new Error('Network error: Unable to connect to server');
        } else {
            return new Error(error.message || 'An unexpected error occurred');
        }
    }
}

// Create singleton instance
export const apiService = new ApiService();

// Export for global access
declare global {
    interface Window {
        apiService: ApiService;
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.apiService = apiService;
}
