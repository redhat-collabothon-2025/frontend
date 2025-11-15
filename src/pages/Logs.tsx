import { useEffect, useState } from 'react';
import { logsService } from '@/services';
import type { Log } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Clock, User, Globe, RefreshCw, Monitor, ChevronLeft, ChevronRight, Shield } from 'lucide-react';

export default function Logs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const fetchLogs = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await logsService.list(page);
      setLogs(response.results || []);
      setTotalCount(response.count || 0);
      setHasNext(!!response.next);
      setHasPrevious(!!response.previous);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, []);

  const handleNextPage = () => {
    if (hasNext) {
      fetchLogs(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (hasPrevious) {
      fetchLogs(currentPage - 1);
    }
  };

  const handleAnalyzeLogs = async () => {
    setAnalyzing(true);
    try {
      const result = await logsService.analyze(totalCount);
      alert(`Analysis Complete!\n\nAnalyzed ${result.results.analyzed} logs\nCreated ${result.results.incidents_created} incidents\n- Critical: ${result.results.critical_risk}\n- Medium: ${result.results.medium_risk}`);
      // Refresh the current page
      fetchLogs(currentPage);
    } catch (error) {
      alert('Analysis Failed. Please try again.');
      console.error('Error analyzing logs:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    return status === 'success' ? 'success' : 'destructive';
  };

  const getActionTypeColor = (actionType: string) => {
    if (actionType.includes('confidential') || actionType.includes('export') || actionType.includes('sensitive')) {
      return 'text-red-400';
    }
    if (actionType.includes('login') || actionType.includes('logout')) {
      return 'text-blue-400';
    }
    if (actionType.includes('download') || actionType.includes('upload')) {
      return 'text-yellow-400';
    }
    return 'text-gray-400';
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
            Employee Logs
          </h1>
          <p className="text-muted-foreground mt-2">
            Security and activity logs from employee systems • {totalCount} total logs
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleAnalyzeLogs}
            disabled={analyzing}
            variant="default"
            className="gap-2"
          >
            <Shield className="h-4 w-4" />
            {analyzing ? 'Analyzing...' : 'Analyze Logs'}
          </Button>
          <Button
            onClick={() => fetchLogs(currentPage)}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {logs.map((log) => (
          <Card key={log.id} className="border-border bg-card hover:shadow-xl hover:border-white transition-all group">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h3 className={`text-lg font-semibold ${getActionTypeColor(log.action_type)} group-hover:text-gray-300 transition-colors`}>
                      {log.action_type.replace(/_/g, ' ').toUpperCase()}
                    </h3>
                    <Badge variant={getStatusBadgeVariant(log.request_status)} className="shadow-sm">
                      {log.request_status}
                    </Badge>
                    <Badge variant="outline" className="shadow-sm">
                      {log.resource_type}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="p-1.5 rounded-md bg-accent">
                        <User className="h-3.5 w-3.5" />
                      </div>
                      <span>Employee: {log.employee_id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="p-1.5 rounded-md bg-accent">
                        <Globe className="h-3.5 w-3.5" />
                      </div>
                      <span>IP: {log.ip_address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="p-1.5 rounded-md bg-accent">
                        <Clock className="h-3.5 w-3.5" />
                      </div>
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="p-1.5 rounded-md bg-accent">
                        <Monitor className="h-3.5 w-3.5" />
                      </div>
                      <span className="truncate">{log.user_agent.substring(0, 30)}...</span>
                    </div>
                  </div>

                  <Card className="bg-accent border-border mt-3">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-muted-foreground">Resource Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Resource: </span>
                          <span className="text-white font-medium">{log.resource_accessed}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Session: </span>
                          <span className="text-white font-mono text-xs">{log.session_id}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
            Page {currentPage} • Showing {logs.length} of {totalCount} logs
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

      {logs.length === 0 && (
        <Card className="border-border bg-card">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No logs found</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Logs will appear here when they are available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
