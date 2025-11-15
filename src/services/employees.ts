import api from '@/lib/api';
import type { User, EmployeeDetail, RiskHistory, PaginatedResponse } from '@/types';

export const employeesService = {
  // GET /api/employees/
  list: async (page?: number, search?: string, riskLevel?: string): Promise<PaginatedResponse<User>> => {
    const params: { page?: number; search?: string; risk_level?: string } = {};
    if (page) params.page = page;
    if (search) params.search = search;
    if (riskLevel && riskLevel !== 'all') params.risk_level = riskLevel;

    const response = await api.get<PaginatedResponse<User>>('/api/employees/', {
      params,
    });
    return response.data;
  },

  // POST /api/employees/
  create: async (user: Partial<User>): Promise<User> => {
    const response = await api.post<User>('/api/employees/', user);
    return response.data;
  },

  // GET /api/employees/{id}/
  get: async (id: string): Promise<EmployeeDetail> => {
    const response = await api.get<EmployeeDetail>(`/api/employees/${id}/`);
    return response.data;
  },

  // PUT /api/employees/{id}/
  update: async (id: string, user: User): Promise<User> => {
    const response = await api.put<User>(`/api/employees/${id}/`, user);
    return response.data;
  },

  // PATCH /api/employees/{id}/
  partialUpdate: async (id: string, updates: Partial<User>): Promise<User> => {
    const response = await api.patch<User>(`/api/employees/${id}/`, updates);
    return response.data;
  },

  // DELETE /api/employees/{id}/
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/employees/${id}/`);
  },

  // GET /api/employees/{id}/history/
  getHistory: async (id: string, page?: number): Promise<PaginatedResponse<RiskHistory>> => {
    const response = await api.get<PaginatedResponse<RiskHistory>>(
      `/api/employees/${id}/history/`,
      {
        params: { page },
      }
    );
    return response.data;
  },

  // POST /api/employees/recalculate/
  recalculate: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/api/employees/recalculate/', {});
    return response.data;
  },
};
