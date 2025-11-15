import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RiskOverview, RiskDistribution } from '@/types';
import { Users, AlertTriangle, TrendingUp, Shield } from 'lucide-react';

export default function Dashboard() {
  const [overview, setOverview] = useState<RiskOverview | null>(null);
  const [distribution, setDistribution] = useState<RiskDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, distributionRes] = await Promise.all([
          api.get('/api/risks/overview/'),
          api.get('/api/risks/distribution/'),
        ]);
        setOverview(overviewRes.data);
        setDistribution(distributionRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">Security risk overview and insights</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card hover:shadow-lg hover:border-white transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
            <div className="p-2 rounded-lg bg-white/10">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{overview?.total_employees || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Active users in system</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card hover:shadow-lg hover:border-white transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Risk Score</CardTitle>
            <div className="p-2 rounded-lg bg-white/10">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {overview?.average_risk_score?.toFixed(1) || '0.0'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Out of 100</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card hover:shadow-lg hover:border-white transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Risk</CardTitle>
            <div className="p-2 rounded-lg bg-white/10">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{overview?.critical_count || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Employees at critical risk</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card hover:shadow-lg hover:border-white transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recent Incidents</CardTitle>
            <div className="p-2 rounded-lg bg-white/10">
              <Shield className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{overview?.recent_incidents || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {distribution.map((item) => (
                <div key={item.risk_level} className="group hover:bg-accent p-3 rounded-lg transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          item.risk_level === 'CRITICAL'
                            ? 'destructive'
                            : item.risk_level === 'MEDIUM'
                            ? 'warning'
                            : 'success'
                        }
                        className="shadow-sm"
                      >
                        {item.risk_level}
                      </Badge>
                      <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">
                        {item.count} employees
                      </span>
                    </div>
                    <span className="text-sm font-bold text-white">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              Risk Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                <span className="text-sm font-medium text-white">Critical</span>
                <span className="text-2xl font-bold text-white">{overview?.critical_count || 0}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                <span className="text-sm font-medium text-gray-400">Medium</span>
                <span className="text-2xl font-bold text-gray-400">{overview?.medium_count || 0}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                <span className="text-sm font-medium text-gray-500">Low</span>
                <span className="text-2xl font-bold text-gray-500">{overview?.low_count || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

