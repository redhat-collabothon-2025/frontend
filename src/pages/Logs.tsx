import { useEffect, useState } from 'react';
import { logsService } from '@/services';
import type { Log } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Clock, User, Globe, RefreshCw, ChevronLeft, ChevronRight, Shield } from 'lucide-react';

export default function Logs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
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
          <p className="text-sm text-muted-foreground/70 mt-1 flex items-center gap-2">
            <Shield className="h-3.5 w-3.5" />
            Auto-analysis enabled: New logs are automatically analyzed for security risks
          </p>
        </div>
        <Button
          onClick={() => fetchLogs(currentPage)}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="space-y-2">
        {logs.map((log) => (
          <Card key={log.id} className="border-border bg-card hover:shadow-lg hover:border-white/30 transition-all group">
            <CardContent className="p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileText className="h-4 w-4 text-white flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <h3 className={`text-xs font-semibold ${getActionTypeColor(log.action_type)} group-hover:text-gray-300 transition-colors`}>
                        {log.action_type.replace(/_/g, ' ').toUpperCase()}
                      </h3>
                      <Badge variant={getStatusBadgeVariant(log.request_status)} className="text-[10px] py-0 h-4">
                        {log.request_status}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] py-0 h-4">
                        {log.resource_type}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-2.5 w-2.5" />
                        {log.employee_id}
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe className="h-2.5 w-2.5" />
                        {log.ip_address}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
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
