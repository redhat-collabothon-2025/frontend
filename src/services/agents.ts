import api from '@/lib/api';
import type { Agent, AgentDetail, AgentStatistics, FileUpload, OfflineEvent } from '@/types';

export const agentsService = {
  // GET /api/agent/list
  list: async (status?: string, userId?: string): Promise<Agent[]> => {
    const params: { status?: string; user_id?: string } = {};
    if (status && status !== 'all') params.status = status;
    if (userId) params.user_id = userId;

    const response = await api.get<Agent[]>('/api/agent/list', {
      params,
    });
    return response.data;
  },

  // GET /api/agent/{agent_id}/detail
  getDetail: async (agentId: string): Promise<AgentDetail> => {
    const response = await api.get<AgentDetail>(`/api/agent/${agentId}/detail`);
    return response.data;
  },

  // GET /api/agent/statistics
  getStatistics: async (): Promise<AgentStatistics> => {
    const response = await api.get<AgentStatistics>('/api/agent/statistics');
    return response.data;
  },

  // GET /api/agent/uploads/list
  getUploads: async (agentId?: string, status?: string): Promise<FileUpload[]> => {
    const params: { agent_id?: string; status?: string } = {};
    if (agentId) params.agent_id = agentId;
    if (status && status !== 'all') params.status = status;

    const response = await api.get<FileUpload[]>('/api/agent/uploads/list', {
      params,
    });
    return response.data;
  },

  // GET /api/agent/uploads/{upload_id}/detail
  getUploadDetail: async (uploadId: string): Promise<FileUpload> => {
    const response = await api.get<FileUpload>(`/api/agent/uploads/${uploadId}/detail`);
    return response.data;
  },

  // GET /api/agent/offline-events/list
  getOfflineEvents: async (agentId?: string, eventType?: string): Promise<OfflineEvent[]> => {
    const params: { agent_id?: string; event_type?: string } = {};
    if (agentId) params.agent_id = agentId;
    if (eventType && eventType !== 'all') params.event_type = eventType;

    const response = await api.get<OfflineEvent[]>('/api/agent/offline-events/list', {
      params,
    });
    return response.data;
  },
};
