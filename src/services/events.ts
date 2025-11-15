import api from '@/lib/api';
import type { Event, EventCreate, PaginatedResponse } from '@/types';

export const eventsService = {
  // GET /api/events/
  list: async (page?: number): Promise<PaginatedResponse<Event>> => {
    const response = await api.get<PaginatedResponse<Event>>('/api/events/', {
      params: { page },
    });
    return response.data;
  },

  // POST /api/events/
  create: async (event: EventCreate): Promise<Event> => {
    const response = await api.post<Event>('/api/events/', event);
    return response.data;
  },

  // GET /api/events/{id}/
  get: async (id: string): Promise<Event> => {
    const response = await api.get<Event>(`/api/events/${id}/`);
    return response.data;
  },
};
