export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    access: string;
    refresh: string;
    user: User;
}

export interface User {
    id: string;
    email: string;
    name: string;
    risk_score: number;
    risk_level: 'LOW' | 'MEDIUM' | 'CRITICAL';
    created_at: string;
}

export interface AuthError {
    message: string;
    errors?: Record<string, string[]>;
}