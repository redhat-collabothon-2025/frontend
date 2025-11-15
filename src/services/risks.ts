import api from '@/lib/api';
import type { RiskOverview, RiskDistribution, RiskTrending, RiskHeatmap } from '@/types';

export const risksService = {
  // GET /api/risks/overview/
  getOverview: async (): Promise<RiskOverview> => {
    const response = await api.get<RiskOverview>('/api/risks/overview/');
    return response.data;
  },

  // GET /api/risks/distribution/
  getDistribution: async (): Promise<RiskDistribution[]> => {
    const response = await api.get<RiskDistribution[]>('/api/risks/distribution/');
    return response.data;
  },

  // GET /api/risks/trending/
  getTrending: async (): Promise<RiskTrending[]> => {
    const response = await api.get<RiskTrending[]>('/api/risks/trending/');
    return response.data;
  },

  // GET /api/risks/heatmap/
  getHeatmap: async (): Promise<RiskHeatmap[]> => {
    const response = await api.get<RiskHeatmap[]>('/api/risks/heatmap/');
    return response.data;
  },
};
