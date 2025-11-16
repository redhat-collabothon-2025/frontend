import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { agentsService } from '@/services';
import type { AgentDetail as AgentDetailType, FileUpload, OfflineEvent } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Cpu,
  Activity,
  User as UserIcon,
  Monitor,
  Globe,
  Calendar,
  RefreshCw,
  Download,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Database,
} from 'lucide-react';
import { toast } from 'sonner';
import { DetailSkeleton } from '@/components/LoadingStates';

export default function AgentDetail() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<AgentDetailType | null>(null);
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [offlineEvents, setOfflineEvents] = useState<OfflineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'uploads' | 'events'>('overview');

  const fetchAgentData = async () => {
    if (!agentId) return;

    setRefreshing(true);
    try {
      console.log('Fetching agent data for:', agentId);

      const agentData = await agentsService.getDetail(agentId);
      console.log('Agent data received:', agentData);
      setAgent(agentData);

      // Fetch uploads and events separately to avoid blocking if they fail
      try {
        const uploadsData = await agentsService.getUploads(agentId);
        console.log('Uploads data received:', uploadsData);
        setUploads(uploadsData || []);
      } catch (uploadError) {
        console.error('Error fetching uploads:', uploadError);
        setUploads([]);
      }

      try {
        const eventsData = await agentsService.getOfflineEvents(agentId);
        console.log('Events data received:', eventsData);
        setOfflineEvents(eventsData || []);
      } catch (eventError) {
        console.error('Error fetching events:', eventError);
        setOfflineEvents([]);
      }
    } catch (error) {
      console.error('Error fetching agent data:', error);
      toast.error('Failed to fetch agent data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAgentData();
  }, [agentId]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'online':
        return 'success';
      case 'offline':
        return 'secondary';
      case 'suspicious':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
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

  const getUploadStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getTimeSinceLastHeartbeat = (heartbeat: string) => {
    const now = new Date();
    const lastHeartbeat = new Date(heartbeat);
    const diffMs = now.getTime() - lastHeartbeat.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (loading) {
    return <DetailSkeleton />;
  }

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertCircle className="h-16 w-16 text-muted-foreground" />
        <p className="text-muted-foreground">Agent not found</p>
        <Button onClick={() => navigate('/agents')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Agents
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate('/agents')}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold text-white">{agent.hostname}</h1>
              <Badge
                variant={getStatusBadgeVariant(agent.status)}
                className={`shadow-sm ${
                  agent.status === 'online'
                    ? 'bg-green-500/90 hover:bg-green-500 border-green-600'
                    : agent.status === 'suspicious'
                    ? 'bg-red-500/90 hover:bg-red-500 border-red-600'
                    : 'bg-gray-500/90 hover:bg-gray-500 border-gray-600'
                }`}
              >
                {agent.status.toUpperCase()}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-2">Agent ID: {agent.agent_id}</p>
          </div>
        </div>
        <Button
          onClick={fetchAgentData}
          disabled={refreshing}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {agent.status === 'online' ? 'Online' : agent.status === 'offline' ? 'Offline' : 'Suspicious'}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                agent.status === 'online' ? 'bg-green-500/10' : agent.status === 'suspicious' ? 'bg-red-500/10' : 'bg-gray-500/10'
              }`}>
                <Activity className={`h-6 w-6 ${
                  agent.status === 'online' ? 'text-green-500' : agent.status === 'suspicious' ? 'text-red-500' : 'text-gray-500'
                }`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">User Risk</p>
                <Badge
                  variant={getRiskBadgeVariant(agent.user_risk_level)}
                  className={`mt-2 text-sm ${
                    agent.user_risk_level === 'CRITICAL'
                      ? 'bg-red-500/90 hover:bg-red-500 border-red-600'
                      : agent.user_risk_level === 'MEDIUM'
                      ? 'bg-yellow-500/90 hover:bg-yellow-500 border-yellow-600 text-black'
                      : ''
                  }`}
                >
                  {agent.user_risk_level}
                </Badge>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">File Uploads</p>
                <p className="text-2xl font-bold text-white mt-1">{uploads.length}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <Download className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Offline Events</p>
                <p className="text-2xl font-bold text-white mt-1">{offlineEvents.length}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                <Database className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="uploads">File Uploads ({uploads.length})</TabsTrigger>
          <TabsTrigger value="events">Offline Events ({offlineEvents.length})</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Information */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  System Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <Cpu className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Hostname</p>
                    <p className="text-white font-medium mt-1">{agent.hostname}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <Monitor className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Operating System</p>
                    <p className="text-white font-medium mt-1">{agent.os_type}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">IP Address</p>
                    <p className="text-white font-medium mt-1 font-mono">{agent.ip_address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Created At</p>
                    <p className="text-white font-medium mt-1">{formatDate(agent.created_at)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Information */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <UserIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="text-white font-medium mt-1">{agent.user_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-white font-medium mt-1">{agent.user_email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Risk Level</p>
                    <Badge
                      variant={getRiskBadgeVariant(agent.user_risk_level)}
                      className={`mt-1 ${
                        agent.user_risk_level === 'CRITICAL'
                          ? 'bg-red-500/90 hover:bg-red-500 border-red-600'
                          : agent.user_risk_level === 'MEDIUM'
                          ? 'bg-yellow-500/90 hover:bg-yellow-500 border-yellow-600 text-black'
                          : ''
                      }`}
                    >
                      {agent.user_risk_level}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <Cpu className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">User ID</p>
                    <p className="text-white font-medium mt-1 font-mono text-sm">{agent.user}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Status */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Activity Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-white">Last Heartbeat</p>
                  <Badge variant="outline" className="text-white border-white/30">
                    {getTimeSinceLastHeartbeat(agent.last_heartbeat)}
                  </Badge>
                </div>
                <p className="text-lg text-white font-medium">{formatDate(agent.last_heartbeat)}</p>
                <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      agent.status === 'online'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : agent.status === 'suspicious'
                        ? 'bg-gradient-to-r from-red-500 to-orange-500'
                        : 'bg-gradient-to-r from-gray-500 to-slate-500'
                    }`}
                    style={{ width: agent.status === 'online' ? '100%' : '30%' }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* File Uploads Tab */}
        <TabsContent value="uploads" className="space-y-4 mt-6">
          {uploads.length > 0 ? (
            <div className="space-y-3">
              {uploads.map((upload) => (
                <Card key={upload.upload_id} className="border-border bg-card">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        {getUploadStatusIcon(upload.upload_status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <p className="text-sm font-medium text-white truncate">
                            {upload.file_path?.split('/').pop() || 'Unknown file'}
                          </p>
                          <Badge
                            variant={
                              upload.upload_status === 'completed'
                                ? 'success'
                                : upload.upload_status === 'pending'
                                ? 'warning'
                                : 'destructive'
                            }
                            className={`flex-shrink-0 ${
                              upload.upload_status === 'completed'
                                ? 'bg-green-500/90 hover:bg-green-500 border-green-600'
                                : upload.upload_status === 'pending'
                                ? 'bg-yellow-500/90 hover:bg-yellow-500 border-yellow-600 text-black'
                                : 'bg-red-500/90 hover:bg-red-500 border-red-600'
                            }`}
                          >
                            {upload.upload_status?.toUpperCase() || 'UNKNOWN'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div>
                            <span className="font-medium">Size:</span> {formatFileSize(upload.file_size || 0)}
                          </div>
                          <div>
                            <span className="font-medium">Started:</span> {upload.upload_started ? formatDate(upload.upload_started) : 'N/A'}
                          </div>
                          {upload.upload_completed && (
                            <div>
                              <span className="font-medium">Completed:</span>{' '}
                              {formatDate(upload.upload_completed)}
                            </div>
                          )}
                          {upload.error_message && (
                            <div className="col-span-2 text-red-400">
                              <span className="font-medium">Error:</span> {upload.error_message}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 font-mono truncate">
                          {upload.file_path || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-border bg-card">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <Download className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No file uploads yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Offline Events Tab */}
        <TabsContent value="events" className="space-y-4 mt-6">
          {offlineEvents.length > 0 ? (
            <div className="space-y-3">
              {offlineEvents.map((event) => (
                <Card key={event.event_id} className="border-border bg-card">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                        <Database className="h-5 w-5 text-purple-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <p className="text-sm font-medium text-white">{event.event_type || 'Unknown Event'}</p>
                          <p className="text-xs text-muted-foreground">
                            {event.event_timestamp ? formatDate(event.event_timestamp) : 'N/A'}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          {event.event_data && Object.entries(event.event_data).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                              {JSON.stringify(value)}
                            </div>
                          ))}
                        </div>
                        {event.synced_at && (
                          <div className="mt-2 flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <p className="text-xs text-green-500">
                              Synced at {formatDate(event.synced_at)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-border bg-card">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <Database className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No offline events recorded</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
