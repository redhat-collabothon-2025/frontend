export interface User {
  id: string;
  email: string;
  name: string;
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'CRITICAL';
  created_at: string;
}

export interface Campaign {
  id: string;
  persona_name: string;
  scenario: string;
  target_count: number;
  click_count: number;
  sent_at: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
}

export interface Incident {
  id: string;
  user: string;
  user_email: string;
  user_name: string;
  incident_type: string;
  severity: 'LOW' | 'MEDIUM' | 'CRITICAL';
  created_at: string;
}

export interface Event {
  id: string;
  event_type: 'phishing_click' | 'bulk_export' | 'usb_connect';
  event_data: Record<string, any>;
  created_at: string;
  user: string;
}

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

export interface CampaignAnalytics {
  click_rate: number;
  completion_rate: number;
  target_count: number;
  click_count: number;
}

