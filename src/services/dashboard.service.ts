import apiClient from '../config/api.config';
import {Campaign, DashboardStats, Event, Incident, PaginatedResponse, RiskHeatmap} from '../types/dashboard.types';
import {User} from '../types/auth.types';

export const dashboardService = {
    async getStats(): Promise<DashboardStats> {
        const [usersRes, campaignsRes, incidentsRes] = await Promise.all([
            apiClient.get<User[]>('/api/users/'),
            apiClient.get<PaginatedResponse<Campaign>>('/api/campaigns/'),
            apiClient.get<PaginatedResponse<Incident>>('/api/incidents/'),
        ]);

        const users = usersRes.data;
        const campaigns = campaignsRes.data.results ?? [];
        const incidents = incidentsRes.data.results ?? [];

        const highRiskUsers = users.filter(
            (u) => u.risk_level === 'CRITICAL' || u.risk_level === 'MEDIUM'
        ).length;

        const activeCampaigns = campaigns.filter(
            (c) => c.status === 'active'
        ).length;

        const avgRiskScore =
            users.length > 0
                ? users.reduce((sum, u) => sum + u.risk_score, 0) / users.length
                : 0;

        return {
            total_users: users.length,
            high_risk_users: highRiskUsers,
            active_campaigns: activeCampaigns,
            recent_incidents: incidents.length,
            avg_risk_score: Math.round(avgRiskScore * 10) / 10,
        };
    },

    async getUsers(): Promise<User[]> {
        const response = await apiClient.get<User[]>('/api/users/');
        return response.data;
    },

    async getCampaigns(): Promise<Campaign[]> {
        const response = await apiClient.get<PaginatedResponse<Campaign>>(
            '/api/campaigns/'
        );
        return response.data.results ?? [];
    },

    async getIncidents(): Promise<Incident[]> {
        const response = await apiClient.get<PaginatedResponse<Incident>>(
            '/api/incidents/'
        );
        return response.data.results ?? [];
    },

    async getEvents(): Promise<Event[]> {
        const response = await apiClient.get<Event[]>('/api/events/');
        return response.data;
    },

    async getRiskTrend(): Promise<any> {
        const response = await apiClient.get('/api/analytics/risk-trend/');
        return response.data;
    },

    async getRisksHeatmap(): Promise<RiskHeatmap[]> {
        const response = await apiClient.get<RiskHeatmap[]>('/api/risks/heatmap');
        return response.data;
    },
};

export default dashboardService;
