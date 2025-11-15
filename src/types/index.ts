// Enums
export type Severity = 'LOW' | 'MEDIUM' | 'CRITICAL';
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed';
export type EventType = 'phishing_click' | 'bulk_export' | 'usb_connect';
export type TemplateType = 'linkedin' | 'general';

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  risk_score: number;
  risk_level: Severity;
  created_at: string;
}

export interface EmployeeDetail extends User {
  incident_count: number;
  last_incident: string | null;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
}

// Campaign Types
export interface Campaign {
  id: string;
  persona_name: string;
  scenario: string;
  target_count: number;
  click_count: number;
  sent_at: string;
  status: CampaignStatus;
}

export interface CampaignCreate {
  persona_name: string;
  scenario: string;
  target_count: number;
  click_count: number;
  sent_at: string;
  status: CampaignStatus;
}

export interface CampaignUpdate {
  persona_name?: string;
  scenario?: string;
  target_count?: number;
  click_count?: number;
  sent_at?: string;
  status?: CampaignStatus;
}

export interface AddTargetsRequest {
  user_ids: string[];
}

export interface CampaignAnalytics {
  click_rate: number;
  completion_rate: number;
  target_count: number;
  click_count: number;
}

// Incident Types
export interface Incident {
  id: string;
  user: string;
  user_email: string;
  user_name: string;
  incident_type: string;
  severity: Severity;
  created_at: string;
}

export interface IncidentCreate {
  user_id: string;
  incident_type: string;
  severity: Severity;
}

export interface IncidentUpdate {
  incident_type?: string;
  severity?: Severity;
}

// Event Types
export interface Event {
  id: string;
  event_type: EventType;
  event_data: Record<string, any>;
  created_at: string;
  user: string;
}

export interface EventCreate {
  user_id: string;
  event_type: EventType;
  event_data: Record<string, any>;
}

// Phishing Types
export interface SendPhishingEmailRequest {
  user_id: string;
  campaign_id?: string | null;
  template_type?: TemplateType;
  tracking_enabled?: boolean;
}

export interface PhishingResponse {
  message: string;
  tracking_id: string;
}

export interface BulkPhishingRequest {
  user_ids: string[];
  campaign_id?: string | null;
  template_type?: TemplateType;
}

export interface BulkPhishingResponse {
  message: string;
  sent_count: number;
  failed_count: number;
}

// Risk Types
export interface RiskOverview {
  total_employees: number;
  average_risk_score: number;
  critical_count: number;
  medium_count: number;
  low_count: number;
  recent_incidents: number;
}

export interface RiskDistribution {
  risk_level: string;
  count: number;
  percentage: number;
}

export interface RiskTrending {
  date: string;
  average_risk_score: number;
  critical_count: number;
  medium_count: number;
  low_count: number;
}

export interface RiskHeatmap {
  department: string;
  week: string;
  risk_score: number;
  incident_count: number;
}

export interface RiskHistory {
  id: number;
  risk_score: number;
  reason: string;
  created_at: string;
  user: string;
}

// Pagination Types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

