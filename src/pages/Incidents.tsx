import { useEffect, useState } from 'react';
import { incidentsService } from '@/services';
import type { Incident } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, User, CheckCircle, RefreshCw, Trash2, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { toast } from 'sonner';

export default function Incidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const fetchIncidents = async (page: number = 1, severity: string = severityFilter) => {
    setLoading(true);
    try {
      const response = await incidentsService.list(page, severity);
      const incidentsList = response.results || response || [];
      setIncidents(incidentsList);
      setTotalCount(response.count || incidentsList.length);
      setHasNext(!!response.next);
      setHasPrevious(!!response.previous);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (incidentId: string) => {
    setResolvingId(incidentId);
    try {
      await incidentsService.resolve(incidentId);
      await fetchIncidents(currentPage, severityFilter);
      toast.success('Incident resolved successfully!');
    } catch (error) {
      console.error('Error resolving incident:', error);
      toast.error('Failed to resolve incident');
    } finally {
      setResolvingId(null);
    }
  };

  const handleDelete = async (incidentId: string) => {
    toast('Are you sure you want to delete this incident?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            await incidentsService.delete(incidentId);
            await fetchIncidents(currentPage, severityFilter);
            toast.success('Incident deleted successfully!');
          } catch (error) {
            console.error('Error deleting incident:', error);
            toast.error('Failed to delete incident');
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  };

  const handleNextPage = () => {
    if (hasNext) {
      fetchIncidents(currentPage + 1, severityFilter);
    }
  };

  const handlePreviousPage = () => {
    if (hasPrevious) {
      fetchIncidents(currentPage - 1, severityFilter);
    }
  };

  const handleSeverityFilterChange = (newSeverity: string) => {
    setSeverityFilter(newSeverity);
    // Reset to page 1 when changing filter
    fetchIncidents(1, newSeverity);
  };

  useEffect(() => {
    fetchIncidents(1, severityFilter);
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
          <p className="text-muted-foreground mt-2">
            Security incidents and events monitoring • {totalCount} total incidents
          </p>
        </div>
        <Button
          onClick={() => fetchIncidents(currentPage, severityFilter)}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground mr-2">Filter by severity:</span>
        <Button
          onClick={() => handleSeverityFilterChange('all')}
          variant={severityFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          className="gap-2"
        >
          All
        </Button>
        <Button
          onClick={() => handleSeverityFilterChange('CRITICAL')}
          variant={severityFilter === 'CRITICAL' ? 'default' : 'outline'}
          size="sm"
          className={`gap-2 ${severityFilter === 'CRITICAL' ? 'bg-red-500 hover:bg-red-600 border-red-600' : ''}`}
        >
          Critical
        </Button>
        <Button
          onClick={() => handleSeverityFilterChange('MEDIUM')}
          variant={severityFilter === 'MEDIUM' ? 'default' : 'outline'}
          size="sm"
          className={`gap-2 ${severityFilter === 'MEDIUM' ? 'bg-yellow-500 hover:bg-yellow-600 border-yellow-600 text-black' : ''}`}
        >
          Medium
        </Button>
        <Button
          onClick={() => handleSeverityFilterChange('LOW')}
          variant={severityFilter === 'LOW' ? 'default' : 'outline'}
          size="sm"
          className="gap-2"
        >
          Low
        </Button>
      </div>

      <div className="space-y-2">
        {incidents.map((incident) => (
          <Card key={incident.id} className="border-border bg-card hover:shadow-lg hover:border-white/30 transition-all group">
            <CardContent className="p-3">
              <div className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-4">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className={`h-5 w-5 flex-shrink-0 ${
                    incident.severity === 'CRITICAL' ? 'text-red-500' :
                    incident.severity === 'MEDIUM' ? 'text-yellow-500' :
                    'text-white'
                  }`} />
                  <h3 className="text-sm font-semibold text-white group-hover:text-gray-300 transition-colors whitespace-nowrap">
                    {incident.incident_type}
                  </h3>
                </div>
                <Badge
                  variant={getSeverityBadgeVariant(incident.severity)}
                  className={`text-xs font-medium ${
                    incident.severity === 'CRITICAL' ? 'bg-red-500/90 hover:bg-red-500 border-red-600' :
                    incident.severity === 'MEDIUM' ? 'bg-yellow-500/90 hover:bg-yellow-500 border-yellow-600 text-black' :
                    ''
                  }`}
                >
                  {incident.severity}
                </Badge>
                <div className="flex flex-col gap-0.5">
                  <span className="flex items-center gap-1 text-sm">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-white font-semibold">{incident.user_name}</span>
                    <span className="text-gray-400">({incident.user_email})</span>
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(incident.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleResolve(incident.id)}
                    disabled={resolvingId === incident.id}
                    size="sm"
                    className="gap-1 h-8 px-3"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{resolvingId === incident.id ? 'Resolving...' : 'Resolve'}</span>
                  </Button>
                  <Button
                    onClick={() => handleDelete(incident.id)}
                    size="sm"
                    variant="destructive"
                    className="gap-1 h-8 px-3"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalCount > 0 && (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="text-sm text-muted-foreground">
            {severityFilter !== 'all' ? (
              `Showing ${incidents.length} ${severityFilter} incidents`
            ) : (
              `Page ${currentPage} • Showing ${incidents.length} of ${totalCount} incidents`
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handlePreviousPage}
              disabled={!hasPrevious}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={!hasNext}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {incidents.length === 0 && (
        <Card className="border-border bg-card">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              {severityFilter === 'all' ? 'No incidents found' : `No ${severityFilter} incidents found`}
            </p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              {severityFilter === 'all' ? 'All systems running smoothly' : 'Try selecting a different severity level'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

