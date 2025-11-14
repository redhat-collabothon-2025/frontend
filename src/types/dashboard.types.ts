export interface Campaign {
    id: string;
    persona_name: string;
    scenario: string;
    target_count: number;
    click_count: number;
    sent_at: string;
    status: 'draft' | 'active' | 'paused' | 'completed';
}

export interface Incident {
    id: string;
    user: string;
    user_email: string;
    user_name: string;
    incident_type: string;
    severity: 'LOW' | 'MEDIUM' | 'CRITICAL';
    created_at: string;
}

export interface Event {
    id: string;
    user: string;
    event_type: 'phishing_click' | 'bulk_export' | 'usb_connect';
    event_data: Record<string, any>;
    created_at: string;
}

export interface RiskHistory {
    id: number;
    risk_score: number;
    reason: string;
    created_at: string;
    user: string;
}

export interface RiskHeatmap {
    department: string;
    week: string;
    risk_score: number;
    incident_count: number;
}

export interface DashboardStats {
    total_users: number;
    high_risk_users: number;
    active_campaigns: number;
    recent_incidents: number;
    avg_risk_score: number;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}