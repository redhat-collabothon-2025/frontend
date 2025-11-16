import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { agentsService } from '@/services';
import type { Agent, AgentStatistics } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Cpu, RefreshCw, Filter, Activity, HardDrive, Wifi, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { ListSkeleton } from '@/components/LoadingStates';

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [statistics, setStatistics] = useState<AgentStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchAgents = async (status: string = statusFilter) => {
    setLoading(true);
    try {
      const agentsList = await agentsService.list(status === 'all' ? undefined : status);
      setAgents(agentsList);
      setFilteredAgents(agentsList);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Failed to fetch agents');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const stats = await agentsService.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  useEffect(() => {
    fetchAgents();
    fetchStatistics();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAgents(agents);
    } else {
      const filtered = agents.filter(
        (agent) =>
          agent.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agent.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agent.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agent.ip_address.includes(searchTerm) ||
          agent.os_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAgents(filtered);
    }
  }, [searchTerm, agents]);

  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    fetchAgents(newStatus);
  };

  const handleRefresh = () => {
    fetchAgents();
    fetchStatistics();
    toast.success('Refreshed successfully!');
  };

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
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
    return <ListSkeleton count={6} />;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white">Agents</h1>
          <p className="text-muted-foreground mt-2">Monitor and manage endpoint agents</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Agents</p>
                  <p className="text-3xl font-bold text-white mt-1">{statistics.total_agents}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                  <Cpu className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Online</p>
                  <p className="text-3xl font-bold text-green-500 mt-1">{statistics.online_agents}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Offline</p>
                  <p className="text-3xl font-bold text-gray-400 mt-1">{statistics.offline_agents}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gray-500/10 flex items-center justify-center">
                  <Wifi className="h-6 w-6 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Suspicious</p>
                  <p className="text-3xl font-bold text-red-500 mt-1">{statistics.suspicious_agents}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
                  <HardDrive className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agents by hostname, user, email, IP, or OS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 bg-background border-border"
            />
          </div>
        </CardHeader>
      </Card>

      {/* Status Filter Buttons */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground mr-2">Filter by status:</span>
        <Button
          onClick={() => handleStatusFilterChange('all')}
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          className="gap-2"
        >
          All
        </Button>
        <Button
          onClick={() => handleStatusFilterChange('online')}
          variant={statusFilter === 'online' ? 'default' : 'outline'}
          size="sm"
          className={`gap-2 ${statusFilter === 'online' ? 'bg-green-500 hover:bg-green-600 border-green-600' : ''}`}
        >
          Online
        </Button>
        <Button
          onClick={() => handleStatusFilterChange('offline')}
          variant={statusFilter === 'offline' ? 'default' : 'outline'}
          size="sm"
          className={`gap-2 ${statusFilter === 'offline' ? 'bg-gray-500 hover:bg-gray-600 border-gray-600' : ''}`}
        >
          Offline
        </Button>
        <Button
          onClick={() => handleStatusFilterChange('suspicious')}
          variant={statusFilter === 'suspicious' ? 'default' : 'outline'}
          size="sm"
          className={`gap-2 ${statusFilter === 'suspicious' ? 'bg-red-500 hover:bg-red-600 border-red-600' : ''}`}
        >
          Suspicious
        </Button>
      </div>

      {/* Agents List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredAgents.map((agent) => (
          <Link key={agent.agent_id} to={`/agents/${agent.agent_id}`}>
            <Card className="border-border bg-card hover:shadow-xl hover:border-white transition-all group cursor-pointer">
              <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-white group-hover:text-gray-300 transition-colors">
                      {agent.hostname}
                    </h3>
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
                    <Badge
                      variant={getRiskBadgeVariant(agent.user_risk_level)}
                      className={`shadow-sm ${
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

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">User</p>
                      <p className="text-white font-medium mt-1">{agent.user_name}</p>
                      <p className="text-muted-foreground text-xs">{agent.user_email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Operating System</p>
                      <p className="text-white font-medium mt-1">{agent.os_type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">IP Address</p>
                      <p className="text-white font-medium mt-1">{agent.ip_address}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Heartbeat</p>
                      <p className="text-white font-medium mt-1">{getTimeSinceLastHeartbeat(agent.last_heartbeat)}</p>
                      <p className="text-muted-foreground text-xs">{formatDate(agent.last_heartbeat)}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Agent ID: <span className="text-white">{agent.agent_id}</span>
                      {' • '}
                      Created: <span className="text-white">{formatDate(agent.created_at)}</span>
                    </p>
                  </div>
                </div>

                {/* Arrow Icon */}
                <div className="flex items-center">
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-white transition-colors" />
                </div>
              </div>
            </CardContent>
          </Card>
          </Link>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <Card className="border-border bg-card">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
              <Cpu className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No agents found</p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              {searchTerm ? 'Try adjusting your search criteria' : 'No agents are currently registered'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
