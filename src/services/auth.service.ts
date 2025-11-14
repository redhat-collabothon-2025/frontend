import apiClient from '../config/api.config';
import { LoginRequest, LoginResponse } from '../types/auth.types';

export const authService = {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>(
            '/api/auth/login/',
            credentials
        );

        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
        }
        if (response.data.refresh) {
            localStorage.setItem('refresh_token', response.data.refresh);
        }

        return response.data;
    },

    async logout(refreshToken: string): Promise<void> {
        try {
            await apiClient.post('/api/auth/logout/', { refresh: refreshToken });
        } catch {}

        this.logoutLocal();
    },

    logoutLocal() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    },

    async refreshToken(refreshToken: string): Promise<string> {
        const response = await apiClient.post('/api/auth/refresh-token/', {
            refresh: refreshToken,
        });

        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
        }

        return response.data.access;
    },

    getAccessToken(): string | null {
        return localStorage.getItem('access_token');
    },

    getRefreshToken(): string | null {
        return localStorage.getItem('refresh_token');
    },

    isAuthenticated(): boolean {
        return !!this.getAccessToken();
    },
};

export default authService;
