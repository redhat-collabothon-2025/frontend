import api from '@/lib/api';
import type {
  SendPhishingEmailRequest,
  PhishingResponse,
  BulkPhishingRequest,
  BulkPhishingResponse,
} from '@/types';

export const phishingService = {
  // POST /api/phishing/send/
  send: async (request: SendPhishingEmailRequest): Promise<PhishingResponse> => {
    const response = await api.post<PhishingResponse>('/api/phishing/send/', request);
    return response.data;
  },

  // POST /api/phishing/bulk-send/
  bulkSend: async (request: BulkPhishingRequest): Promise<BulkPhishingResponse> => {
    const response = await api.post<BulkPhishingResponse>('/api/phishing/bulk-send/', request);
    return response.data;
  },

  // GET /api/phishing/track/{tracking_id}/
  // This endpoint is typically called by email clients to track email opens
  // Returns a tracking pixel
  track: async (trackingId: string): Promise<void> => {
    await api.get(`/api/phishing/track/${trackingId}/`);
  },

  // GET /api/phishing/click/{tracking_id}/
  // This endpoint redirects to a warning page when a phishing link is clicked
  // Returns 302 redirect
  click: async (trackingId: string): Promise<void> => {
    await api.get(`/api/phishing/click/${trackingId}/`);
  },
};
