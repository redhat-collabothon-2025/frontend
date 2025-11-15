import { useEffect, useState } from 'react';
import api from '@/lib/api';
import type { Incident } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, User } from 'lucide-react';

export default function Incidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await api.get('/api/incidents/');
        setIncidents(response.data.results || response.data);
      } catch (error) {
        console.error('Error fetching incidents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'destructive';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'success';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Incidents
          </h1>
          <p className="text-muted-foreground mt-2">Security incidents and events monitoring</p>
        </div>
      </div>

      <div className="space-y-4">
        {incidents.map((incident) => (
          <Card key={incident.id} className="border-border bg-card hover:shadow-xl hover:border-white transition-all group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      incident.severity === 'CRITICAL' ? 'bg-white/20 border border-white/30' :
                      incident.severity === 'MEDIUM' ? 'bg-white/15 border border-white/20' : 
                      'bg-white/10 border border-white/15'
                    }`}>
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-white group-hover:text-gray-300 transition-colors">
                        {incident.incident_type}
                      </h3>
                      <Badge variant={getSeverityBadgeVariant(incident.severity)} className="shadow-sm">
                        {incident.severity}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="p-1.5 rounded-md bg-accent">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <span>{incident.user_name}</span>
                        <span className="text-muted-foreground/60">({incident.user_email})</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="p-1.5 rounded-md bg-accent">
                          <Clock className="h-3.5 w-3.5" />
                        </div>
                        <span>{new Date(incident.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {incidents.length === 0 && (
        <Card className="border-border bg-card">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No incidents found</p>
            <p className="text-sm text-muted-foreground/60 mt-1">All systems running smoothly</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

