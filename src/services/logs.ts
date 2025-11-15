import api from '@/lib/api';
import type { Log, PaginatedResponse } from '@/types';

export const logsService = {
  // GET /api/logs/
  list: async (page?: number): Promise<PaginatedResponse<Log>> => {
    const response = await api.get<PaginatedResponse<Log>>('/api/logs/', {
      params: { page },
    });
    return response.data;
  },

  // GET /api/logs/{id}/
  get: async (id: string): Promise<Log> => {
    const response = await api.get<Log>(`/api/logs/${id}/`);
    return response.data;
  },

  // POST /api/logs/analyze/
  analyze: async (limit?: number) => {
    const response = await api.post('/api/logs/analyze/', {
      limit: limit || 100,
    });
    return response.data;
  },
};
