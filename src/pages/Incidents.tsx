import { useEffect, useState } from 'react';
import { incidentsService } from '@/services';
import type { Incident } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, User, CheckCircle, RefreshCw, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Incidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const fetchIncidents = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await incidentsService.list(page);
      setIncidents(response.results || []);
      setTotalCount(response.count || 0);
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
      await fetchIncidents(currentPage);
      alert('Incident resolved successfully!');
    } catch (error) {
      console.error('Error resolving incident:', error);
      alert('Failed to resolve incident');
    } finally {
      setResolvingId(null);
    }
  };

  const handleDelete = async (incidentId: string) => {
    if (!confirm('Are you sure you want to delete this incident?')) return;

    try {
      await incidentsService.delete(incidentId);
      await fetchIncidents(currentPage);
      alert('Incident deleted successfully!');
    } catch (error) {
      console.error('Error deleting incident:', error);
      alert('Failed to delete incident');
    }
  };

  const handleNextPage = () => {
    if (hasNext) {
      fetchIncidents(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (hasPrevious) {
      fetchIncidents(currentPage - 1);
    }
  };

  useEffect(() => {
    fetchIncidents(1);
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
          onClick={() => fetchIncidents(currentPage)}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="space-y-2">
        {incidents.map((incident) => (
          <Card key={incident.id} className={`border hover:shadow-lg transition-all group ${
            incident.severity === 'CRITICAL' ? 'bg-red-900/40 border-red-600/60 hover:border-red-500' :
            incident.severity === 'MEDIUM' ? 'bg-yellow-900/40 border-yellow-600/60 hover:border-yellow-500' :
            'bg-card border-border hover:border-white/30'
          }`}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <AlertTriangle className={`h-4 w-4 flex-shrink-0 ${
                    incident.severity === 'CRITICAL' ? 'text-red-300' :
                    incident.severity === 'MEDIUM' ? 'text-yellow-300' :
                    'text-white'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <h3 className={`text-xs font-semibold ${
                        incident.severity === 'CRITICAL' ? 'text-red-200' :
                        incident.severity === 'MEDIUM' ? 'text-yellow-200' :
                        'text-white'
                      } group-hover:text-gray-300 transition-colors`}>
                        {incident.incident_type}
                      </h3>
                      <Badge variant={getSeverityBadgeVariant(incident.severity)} className="text-[10px] py-0 h-4">
                        {incident.severity}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-2.5 w-2.5" />
                        {incident.user_name} ({incident.user_email})
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {new Date(incident.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    onClick={() => handleResolve(incident.id)}
                    disabled={resolvingId === incident.id}
                    size="sm"
                    className="gap-1 h-7 px-2 text-xs"
                  >
                    <CheckCircle className="h-3 w-3" />
                    <span className="hidden sm:inline">{resolvingId === incident.id ? 'Resolving...' : 'Resolve'}</span>
                  </Button>
                  <Button
                    onClick={() => handleDelete(incident.id)}
                    size="sm"
                    variant="destructive"
                    className="gap-1 h-7 px-2 text-xs"
                  >
                    <Trash2 className="h-3 w-3" />
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
            Page {currentPage} • Showing {incidents.length} of {totalCount} incidents
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
            <p className="text-muted-foreground">No incidents found</p>
            <p className="text-sm text-muted-foreground/60 mt-1">All systems running smoothly</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

