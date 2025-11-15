import api from '@/lib/api';
import type { LoginRequest, LoginResponse, RefreshTokenResponse, User } from '@/types';

export const authService = {
  // POST /api/auth/login/
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/api/auth/login/', credentials);
    return response.data;
  },

  // POST /api/auth/logout/
  logout: async (refreshToken: string): Promise<void> => {
    await api.post('/api/auth/logout/', { refresh: refreshToken });
  },

  // GET /api/auth/me/
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/api/auth/me/');
    return response.data;
  },

  // POST /api/auth/refresh-token/
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await api.post<RefreshTokenResponse>('/api/auth/refresh-token/', {
      refresh: refreshToken,
    });
    return response.data;
  },
};
