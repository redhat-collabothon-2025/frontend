import { useEffect, useState } from 'react';
import { eventsService } from '@/services';
import type { Event } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Clock, User, RefreshCw } from 'lucide-react';

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await eventsService.list();
      setEvents(response.results || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case 'phishing_click':
        return { variant: 'destructive' as const, label: 'Phishing Click' };
      case 'bulk_export':
        return { variant: 'warning' as const, label: 'Bulk Export' };
      case 'usb_connect':
        return { variant: 'default' as const, label: 'USB Connect' };
      default:
        return { variant: 'secondary' as const, label: type };
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
            Events
          </h1>
          <p className="text-muted-foreground mt-2">Security events and user activities</p>
        </div>
        <Button
          onClick={fetchEvents}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {events.map((event) => {
          const eventType = getEventTypeBadge(event.event_type);

          return (
            <Card key={event.id} className="border-border bg-card hover:shadow-xl hover:border-white transition-all group">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-white group-hover:text-gray-300 transition-colors">
                        {eventType.label}
                      </h3>
                      <Badge variant={eventType.variant} className="shadow-sm">
                        {event.event_type}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm mb-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="p-1.5 rounded-md bg-accent">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <span>User ID: {event.user.slice(0, 8)}...</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="p-1.5 rounded-md bg-accent">
                          <Clock className="h-3.5 w-3.5" />
                        </div>
                        <span>{new Date(event.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                    {Object.keys(event.event_data).length > 0 && (
                      <Card className="bg-accent border-border mt-3">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-muted-foreground">Event Data</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <pre className="text-xs text-white overflow-x-auto">
                            {JSON.stringify(event.event_data, null, 2)}
                          </pre>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {events.length === 0 && (
        <Card className="border-border bg-card">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No events found</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Events will appear here when they occur</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
