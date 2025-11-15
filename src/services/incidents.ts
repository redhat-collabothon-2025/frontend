import api from '@/lib/api';
import type { Incident, IncidentCreate, IncidentUpdate, PaginatedResponse } from '@/types';

export const incidentsService = {
  // GET /api/incidents/
  list: async (page?: number): Promise<PaginatedResponse<Incident>> => {
    const response = await api.get<PaginatedResponse<Incident>>('/api/incidents/', {
      params: { page },
    });
    return response.data;
  },

  // POST /api/incidents/
  create: async (incident: IncidentCreate): Promise<Incident> => {
    const response = await api.post<Incident>('/api/incidents/', incident);
    return response.data;
  },

  // GET /api/incidents/{id}/
  get: async (id: string): Promise<Incident> => {
    const response = await api.get<Incident>(`/api/incidents/${id}/`);
    return response.data;
  },

  // PUT /api/incidents/{id}/
  update: async (id: string, incident: Incident): Promise<Incident> => {
    const response = await api.put<Incident>(`/api/incidents/${id}/`, incident);
    return response.data;
  },

  // PATCH /api/incidents/{id}/
  partialUpdate: async (id: string, updates: IncidentUpdate): Promise<Incident> => {
    const response = await api.patch<Incident>(`/api/incidents/${id}/`, updates);
    return response.data;
  },

  // DELETE /api/incidents/{id}/
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/incidents/${id}/`);
  },

  // POST /api/incidents/{id}/resolve/
  resolve: async (id: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(`/api/incidents/${id}/resolve/`, {});
    return response.data;
  },
};
