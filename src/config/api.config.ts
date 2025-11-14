import axios from 'axios';
import {authService} from '../services/auth.service';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((p) => {
        if (error) {
            p.reject(error);
        } else {
            p.resolve(token);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.request.use(
    (config) => {
        const token = authService.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject});
                }).then((token) => {
                    original.headers.Authorization = `Bearer ${token}`;
                    return apiClient(original);
                });
            }

            original._retry = true;
            isRefreshing = true;

            const refresh = authService.getRefreshToken();
            if (!refresh) {
                isRefreshing = false;
                processQueue(null, null);
                authService.logoutLocal();
                // Use replace to prevent back button issues
                window.location.replace("/login");
                return Promise.reject(error);
            }

            try {
                const newAccess = await authService.refreshToken(refresh);
                processQueue(null, newAccess);
                original.headers.Authorization = `Bearer ${newAccess}`;
                return apiClient(original);
            } catch (err) {
                processQueue(err, null);
                authService.logoutLocal();
                // Use replace to prevent back button issues
                window.location.replace("/login");
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
