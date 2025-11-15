import api from '@/lib/api';
import type { User } from '@/types';

export const usersService = {
  // GET /api/users/
  list: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/api/users/');
    return response.data;
  },
};
