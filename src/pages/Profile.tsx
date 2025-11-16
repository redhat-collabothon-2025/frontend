import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { employeesService } from '@/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { EmployeeDetail, RiskHistory } from '@/types';
import {
  User as UserIcon,
  Mail,
  Calendar,
  Shield,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const { user } = useAuth();
  const [employeeDetail, setEmployeeDetail] = useState<EmployeeDetail | null>(null);
  const [riskHistory, setRiskHistory] = useState<RiskHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfileData = async () => {
    if (!user?.id) return;

    setRefreshing(true);
    try {
      const [detail, history] = await Promise.all([
        employeesService.get(user.id),
        employeesService.getHistory(user.id),
      ]);
      setEmployeeDetail(detail);
      setRiskHistory(history.results || []);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast.error('Failed to fetch profile data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [user?.id]);

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
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-white">My Profile</h1>
          <p className="text-muted-foreground mt-2">View and manage your account information</p>
        </div>
        <Button
          onClick={fetchProfileData}
          disabled={refreshing}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {/* Profile Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Risk Score</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {employeeDetail?.risk_score.toFixed(1) || user?.risk_score.toFixed(1) || '0.0'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Risk Level</p>
                <Badge
                  variant={getRiskBadgeVariant(employeeDetail?.risk_level || user?.risk_level || 'LOW')}
                  className={`mt-2 text-sm ${
                    (employeeDetail?.risk_level || user?.risk_level) === 'CRITICAL'
                      ? 'bg-red-500/90 hover:bg-red-500 border-red-600'
                      : (employeeDetail?.risk_level || user?.risk_level) === 'MEDIUM'
                      ? 'bg-yellow-500/90 hover:bg-yellow-500 border-yellow-600 text-black'
                      : ''
                  }`}
                >
                  {employeeDetail?.risk_level || user?.risk_level || 'LOW'}
                </Badge>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Incidents</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {employeeDetail?.incident_count || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Account Status</p>
                <div className="flex items-center gap-2 mt-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <p className="text-sm font-medium text-white">Active</p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <UserIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Full Name</p>
                <p className="text-white font-medium mt-1">{user?.name || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Email Address</p>
                <p className="text-white font-medium mt-1">{user?.email || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Member Since</p>
                <p className="text-white font-medium mt-1">
                  {user?.created_at ? formatDate(user.created_at) : 'Not available'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">User ID</p>
                <p className="text-white font-medium mt-1 font-mono text-sm">{user?.id || 'Not available'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Overview */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-white">Current Risk Score</p>
                <Badge variant="outline" className="text-white border-white/30">
                  Updated
                </Badge>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold text-white">
                  {employeeDetail?.risk_score.toFixed(1) || user?.risk_score.toFixed(1) || '0.0'}
                </p>
                <p className="text-sm text-muted-foreground">/ 100</p>
              </div>
              <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((employeeDetail?.risk_score || user?.risk_score || 0), 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white/5 border border-border">
                <p className="text-xs text-muted-foreground">Risk Level</p>
                <p className="text-lg font-bold text-white mt-1">
                  {employeeDetail?.risk_level || user?.risk_level || 'LOW'}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-border">
                <p className="text-xs text-muted-foreground">Incidents</p>
                <p className="text-lg font-bold text-white mt-1">
                  {employeeDetail?.incident_count || 0}
                </p>
              </div>
            </div>

            {employeeDetail?.last_incident && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-400 mb-1">Last Incident</p>
                <p className="text-sm text-white">{formatDate(employeeDetail.last_incident)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Risk History */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Risk Score History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {riskHistory.length > 0 ? (
            <div className="space-y-3">
              {riskHistory.slice(0, 10).map((history) => (
                <div
                  key={history.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-border"
                >
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-medium text-white">
                        Score: {history.risk_score.toFixed(1)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(history.created_at)}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">{history.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No risk history available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
