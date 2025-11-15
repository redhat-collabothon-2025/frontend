# API Usage Examples

This document demonstrates how to use all the implemented API services in your React components.

## Table of Contents
- [Authentication](#authentication)
- [Campaigns](#campaigns)
- [Employees](#employees)
- [Events](#events)
- [Incidents](#incidents)
- [Phishing](#phishing)
- [Risks](#risks)
- [Users](#users)

## Authentication

The authentication service is already integrated into the `AuthContext`. Use the `useAuth` hook to access authentication functions:

```tsx
import { useAuth } from '@/contexts/AuthContext';

function LoginPage() {
  const { login, logout, user, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    await login('user@example.com', 'password');
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

## Campaigns

### List all campaigns with pagination

```tsx
import { useEffect, useState } from 'react';
import { campaignsService } from '@/services';
import type { Campaign, PaginatedResponse } from '@/types';

function CampaignsList() {
  const [campaigns, setCampaigns] = useState<PaginatedResponse<Campaign> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await campaignsService.list();
        setCampaigns(data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {campaigns?.results.map((campaign) => (
        <div key={campaign.id}>
          <h3>{campaign.persona_name}</h3>
          <p>{campaign.scenario}</p>
          <p>Status: {campaign.status}</p>
        </div>
      ))}
    </div>
  );
}
```

### Create a new campaign

```tsx
import { useState } from 'react';
import { campaignsService } from '@/services';
import type { CampaignCreate } from '@/types';

function CreateCampaign() {
  const [campaignData, setCampaignData] = useState<CampaignCreate>({
    persona_name: '',
    scenario: '',
    target_count: 0,
    click_count: 0,
    sent_at: new Date().toISOString(),
    status: 'draft',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newCampaign = await campaignsService.create(campaignData);
      console.log('Campaign created:', newCampaign);
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Persona Name"
        value={campaignData.persona_name}
        onChange={(e) => setCampaignData({ ...campaignData, persona_name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Scenario"
        value={campaignData.scenario}
        onChange={(e) => setCampaignData({ ...campaignData, scenario: e.target.value })}
      />
      <button type="submit">Create Campaign</button>
    </form>
  );
}
```

### Launch/Pause a campaign

```tsx
import { campaignsService } from '@/services';

async function launchCampaign(campaignId: string, campaign: Campaign) {
  try {
    const updatedCampaign = await campaignsService.launch(campaignId, campaign);
    console.log('Campaign launched:', updatedCampaign);
  } catch (error) {
    console.error('Error launching campaign:', error);
  }
}

async function pauseCampaign(campaignId: string, campaign: Campaign) {
  try {
    const updatedCampaign = await campaignsService.pause(campaignId, campaign);
    console.log('Campaign paused:', updatedCampaign);
  } catch (error) {
    console.error('Error pausing campaign:', error);
  }
}
```

### Get campaign analytics

```tsx
import { useEffect, useState } from 'react';
import { campaignsService } from '@/services';
import type { CampaignAnalytics } from '@/types';

function CampaignAnalytics({ campaignId }: { campaignId: string }) {
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await campaignsService.getAnalytics(campaignId);
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, [campaignId]);

  return (
    <div>
      <p>Click Rate: {analytics?.click_rate}%</p>
      <p>Completion Rate: {analytics?.completion_rate}%</p>
      <p>Target Count: {analytics?.target_count}</p>
      <p>Click Count: {analytics?.click_count}</p>
    </div>
  );
}
```

### Add targets to campaign

```tsx
import { campaignsService } from '@/services';

async function addTargetsToCampaign(campaignId: string, userIds: string[]) {
  try {
    const response = await campaignsService.addTargets(campaignId, { user_ids: userIds });
    console.log(response.message);
  } catch (error) {
    console.error('Error adding targets:', error);
  }
}
```

## Employees

### List all employees

```tsx
import { useEffect, useState } from 'react';
import { employeesService } from '@/services';
import type { User, PaginatedResponse } from '@/types';

function EmployeesList() {
  const [employees, setEmployees] = useState<PaginatedResponse<User> | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await employeesService.list();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div>
      {employees?.results.map((employee) => (
        <div key={employee.id}>
          <h3>{employee.name}</h3>
          <p>{employee.email}</p>
          <p>Risk Score: {employee.risk_score}</p>
          <p>Risk Level: {employee.risk_level}</p>
        </div>
      ))}
    </div>
  );
}
```

### Get employee details with incident count

```tsx
import { useEffect, useState } from 'react';
import { employeesService } from '@/services';
import type { EmployeeDetail } from '@/types';

function EmployeeDetailPage({ employeeId }: { employeeId: string }) {
  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await employeesService.get(employeeId);
        setEmployee(data);
      } catch (error) {
        console.error('Error fetching employee:', error);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  return (
    <div>
      <h2>{employee?.name}</h2>
      <p>Email: {employee?.email}</p>
      <p>Risk Score: {employee?.risk_score}</p>
      <p>Incident Count: {employee?.incident_count}</p>
      <p>Last Incident: {employee?.last_incident || 'None'}</p>
    </div>
  );
}
```

### Get employee risk history

```tsx
import { useEffect, useState } from 'react';
import { employeesService } from '@/services';
import type { RiskHistory, PaginatedResponse } from '@/types';

function EmployeeRiskHistory({ employeeId }: { employeeId: string }) {
  const [history, setHistory] = useState<PaginatedResponse<RiskHistory> | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await employeesService.getHistory(employeeId);
        setHistory(data);
      } catch (error) {
        console.error('Error fetching risk history:', error);
      }
    };

    fetchHistory();
  }, [employeeId]);

  return (
    <div>
      <h3>Risk History</h3>
      {history?.results.map((record) => (
        <div key={record.id}>
          <p>Score: {record.risk_score}</p>
          <p>Reason: {record.reason}</p>
          <p>Date: {new Date(record.created_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}
```

### Recalculate risk scores

```tsx
import { employeesService } from '@/services';

async function recalculateRiskScores() {
  try {
    const response = await employeesService.recalculate();
    console.log(response.message);
  } catch (error) {
    console.error('Error recalculating risk scores:', error);
  }
}
```

## Events

### List all events

```tsx
import { useEffect, useState } from 'react';
import { eventsService } from '@/services';
import type { Event, PaginatedResponse } from '@/types';

function EventsList() {
  const [events, setEvents] = useState<PaginatedResponse<Event> | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventsService.list();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      {events?.results.map((event) => (
        <div key={event.id}>
          <p>Type: {event.event_type}</p>
          <p>Created: {new Date(event.created_at).toLocaleString()}</p>
          <pre>{JSON.stringify(event.event_data, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
}
```

### Create an event

```tsx
import { eventsService } from '@/services';
import type { EventCreate } from '@/types';

async function createEvent(userId: string) {
  const eventData: EventCreate = {
    user_id: userId,
    event_type: 'phishing_click',
    event_data: {
      url: 'https://example.com/phishing',
      timestamp: new Date().toISOString(),
    },
  };

  try {
    const newEvent = await eventsService.create(eventData);
    console.log('Event created:', newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
  }
}
```

## Incidents

### List all incidents

```tsx
import { useEffect, useState } from 'react';
import { incidentsService } from '@/services';
import type { Incident, PaginatedResponse } from '@/types';

function IncidentsList() {
  const [incidents, setIncidents] = useState<PaginatedResponse<Incident> | null>(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const data = await incidentsService.list();
        setIncidents(data);
      } catch (error) {
        console.error('Error fetching incidents:', error);
      }
    };

    fetchIncidents();
  }, []);

  return (
    <div>
      {incidents?.results.map((incident) => (
        <div key={incident.id}>
          <h3>{incident.incident_type}</h3>
          <p>User: {incident.user_name} ({incident.user_email})</p>
          <p>Severity: {incident.severity}</p>
          <p>Created: {new Date(incident.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
```

### Create an incident

```tsx
import { incidentsService } from '@/services';
import type { IncidentCreate } from '@/types';

async function createIncident(userId: string) {
  const incidentData: IncidentCreate = {
    user_id: userId,
    incident_type: 'Phishing Email Clicked',
    severity: 'MEDIUM',
  };

  try {
    const newIncident = await incidentsService.create(incidentData);
    console.log('Incident created:', newIncident);
  } catch (error) {
    console.error('Error creating incident:', error);
  }
}
```

### Resolve an incident

```tsx
import { incidentsService } from '@/services';

async function resolveIncident(incidentId: string) {
  try {
    const response = await incidentsService.resolve(incidentId);
    console.log(response.message);
  } catch (error) {
    console.error('Error resolving incident:', error);
  }
}
```

## Phishing

### Send phishing email to a user

```tsx
import { phishingService } from '@/services';
import type { SendPhishingEmailRequest } from '@/types';

async function sendPhishingEmail(userId: string, campaignId: string) {
  const request: SendPhishingEmailRequest = {
    user_id: userId,
    campaign_id: campaignId,
    template_type: 'linkedin',
    tracking_enabled: true,
  };

  try {
    const response = await phishingService.send(request);
    console.log(response.message);
    console.log('Tracking ID:', response.tracking_id);
  } catch (error) {
    console.error('Error sending phishing email:', error);
  }
}
```

### Send bulk phishing emails

```tsx
import { phishingService } from '@/services';
import type { BulkPhishingRequest } from '@/types';

async function sendBulkPhishing(userIds: string[], campaignId: string) {
  const request: BulkPhishingRequest = {
    user_ids: userIds,
    campaign_id: campaignId,
    template_type: 'general',
  };

  try {
    const response = await phishingService.bulkSend(request);
    console.log(`Sent: ${response.sent_count}, Failed: ${response.failed_count}`);
  } catch (error) {
    console.error('Error sending bulk phishing:', error);
  }
}
```

## Risks

### Get risk overview dashboard data

```tsx
import { useEffect, useState } from 'react';
import { risksService } from '@/services';
import type { RiskOverview } from '@/types';

function RiskOverviewDashboard() {
  const [overview, setOverview] = useState<RiskOverview | null>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const data = await risksService.getOverview();
        setOverview(data);
      } catch (error) {
        console.error('Error fetching risk overview:', error);
      }
    };

    fetchOverview();
  }, []);

  return (
    <div>
      <h2>Risk Overview</h2>
      <p>Total Employees: {overview?.total_employees}</p>
      <p>Average Risk Score: {overview?.average_risk_score}</p>
      <p>Critical: {overview?.critical_count}</p>
      <p>Medium: {overview?.medium_count}</p>
      <p>Low: {overview?.low_count}</p>
      <p>Recent Incidents: {overview?.recent_incidents}</p>
    </div>
  );
}
```

### Get risk distribution

```tsx
import { useEffect, useState } from 'react';
import { risksService } from '@/services';
import type { RiskDistribution } from '@/types';

function RiskDistributionChart() {
  const [distribution, setDistribution] = useState<RiskDistribution[]>([]);

  useEffect(() => {
    const fetchDistribution = async () => {
      try {
        const data = await risksService.getDistribution();
        setDistribution(data);
      } catch (error) {
        console.error('Error fetching distribution:', error);
      }
    };

    fetchDistribution();
  }, []);

  return (
    <div>
      <h3>Risk Distribution</h3>
      {distribution.map((item, index) => (
        <div key={index}>
          <p>{item.risk_level}: {item.count} ({item.percentage}%)</p>
        </div>
      ))}
    </div>
  );
}
```

### Get risk trending data

```tsx
import { useEffect, useState } from 'react';
import { risksService } from '@/services';
import type { RiskTrending } from '@/types';

function RiskTrendingChart() {
  const [trending, setTrending] = useState<RiskTrending[]>([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await risksService.getTrending();
        setTrending(data);
      } catch (error) {
        console.error('Error fetching trending:', error);
      }
    };

    fetchTrending();
  }, []);

  return (
    <div>
      <h3>Risk Trends</h3>
      {trending.map((item, index) => (
        <div key={index}>
          <p>Date: {item.date}</p>
          <p>Avg Score: {item.average_risk_score}</p>
          <p>Critical: {item.critical_count} | Medium: {item.medium_count} | Low: {item.low_count}</p>
        </div>
      ))}
    </div>
  );
}
```

### Get risk heatmap

```tsx
import { useEffect, useState } from 'react';
import { risksService } from '@/services';
import type { RiskHeatmap } from '@/types';

function RiskHeatmapView() {
  const [heatmap, setHeatmap] = useState<RiskHeatmap[]>([]);

  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const data = await risksService.getHeatmap();
        setHeatmap(data);
      } catch (error) {
        console.error('Error fetching heatmap:', error);
      }
    };

    fetchHeatmap();
  }, []);

  return (
    <div>
      <h3>Risk Heatmap</h3>
      {heatmap.map((item, index) => (
        <div key={index}>
          <p>Department: {item.department}</p>
          <p>Week: {item.week}</p>
          <p>Risk Score: {item.risk_score}</p>
          <p>Incidents: {item.incident_count}</p>
        </div>
      ))}
    </div>
  );
}
```

## Users

### List all users

```tsx
import { useEffect, useState } from 'react';
import { usersService } from '@/services';
import type { User } from '@/types';

function UsersList() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await usersService.list();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          <p>{user.name} - {user.email}</p>
        </div>
      ))}
    </div>
  );
}
```

## Error Handling

All API calls should include proper error handling. Here's a recommended pattern:

```tsx
import { useState } from 'react';
import { campaignsService } from '@/services';

function CampaignComponent() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await campaignsService.list();
      // Handle success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <button onClick={handleAction}>Fetch Campaigns</button>
    </div>
  );
}
```

## Notes

- All API services are exported from `@/services`
- The API client automatically handles JWT authentication via interceptors
- Token refresh is handled automatically when a 401 error is received
- All dates are returned as ISO 8601 strings
- UUIDs are used for all entity IDs
