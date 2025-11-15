import api from '@/lib/api';
import type {
  Campaign,
  CampaignCreate,
  CampaignUpdate,
  CampaignAnalytics,
  AddTargetsRequest,
  PaginatedResponse,
} from '@/types';

export const campaignsService = {
  // GET /api/campaigns/
  list: async (page?: number): Promise<PaginatedResponse<Campaign>> => {
    const response = await api.get<PaginatedResponse<Campaign>>('/api/campaigns/', {
      params: { page },
    });
    return response.data;
  },

  // POST /api/campaigns/
  create: async (campaign: CampaignCreate): Promise<Campaign> => {
    const response = await api.post<Campaign>('/api/campaigns/', campaign);
    return response.data;
  },

  // GET /api/campaigns/{id}/
  get: async (id: string): Promise<Campaign> => {
    const response = await api.get<Campaign>(`/api/campaigns/${id}/`);
    return response.data;
  },

  // PUT /api/campaigns/{id}/
  update: async (id: string, campaign: Campaign): Promise<Campaign> => {
    const response = await api.put<Campaign>(`/api/campaigns/${id}/`, campaign);
    return response.data;
  },

  // PATCH /api/campaigns/{id}/
  partialUpdate: async (id: string, updates: CampaignUpdate): Promise<Campaign> => {
    const response = await api.patch<Campaign>(`/api/campaigns/${id}/`, updates);
    return response.data;
  },

  // DELETE /api/campaigns/{id}/
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/campaigns/${id}/`);
  },

  // POST /api/campaigns/{id}/add-targets/
  addTargets: async (id: string, targets: AddTargetsRequest): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(
      `/api/campaigns/${id}/add-targets/`,
      targets
    );
    return response.data;
  },

  // GET /api/campaigns/{id}/analytics/
  getAnalytics: async (id: string): Promise<CampaignAnalytics> => {
    const response = await api.get<CampaignAnalytics>(`/api/campaigns/${id}/analytics/`);
    return response.data;
  },

  // POST /api/campaigns/{id}/launch/
  launch: async (id: string, campaign: Campaign): Promise<Campaign> => {
    const response = await api.post<Campaign>(`/api/campaigns/${id}/launch/`, campaign);
    return response.data;
  },

  // POST /api/campaigns/{id}/pause/
  pause: async (id: string, campaign: Campaign): Promise<Campaign> => {
    const response = await api.post<Campaign>(`/api/campaigns/${id}/pause/`, campaign);
    return response.data;
  },
};
