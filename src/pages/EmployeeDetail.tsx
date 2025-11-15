import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { employeesService, phishingService } from '@/services';
import type { EmployeeDetail as EmployeeDetailType, RiskHistory } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Calendar, TrendingUp, Send, History, Trash2 } from 'lucide-react';

export default function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<EmployeeDetailType | null>(null);
  const [riskHistory, setRiskHistory] = useState<RiskHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingPhishing, setSendingPhishing] = useState(false);

  const fetchEmployee = async () => {
    try {
      const data = await employeesService.get(id!);
      setEmployee(data);
    } catch (error) {
      console.error('Error fetching employee:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRiskHistory = async () => {
    try {
      const response = await employeesService.getHistory(id!);
      setRiskHistory(response.results || []);
    } catch (error) {
      console.error('Error fetching risk history:', error);
    }
  };

  const handleSendPhishing = async () => {
    if (!id) return;

    setSendingPhishing(true);
    try {
      const response = await phishingService.send({
        user_id: id,
        template_type: 'linkedin',
        tracking_enabled: true,
      });
      alert(`Phishing email sent successfully! Tracking ID: ${response.tracking_id}`);
    } catch (error) {
      console.error('Error sending phishing email:', error);
      alert('Failed to send phishing email');
    } finally {
      setSendingPhishing(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this employee? This action cannot be undone.')) return;

    try {
      await employeesService.delete(id);
      alert('Employee deleted successfully!');
      navigate('/employees');
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee');
    }
  };

  useEffect(() => {
    if (id) {
      fetchEmployee();
      fetchRiskHistory();
    }
  }, [id]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Employee not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/employees">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{employee.name}</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {employee.email}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            onClick={handleSendPhishing}
            disabled={sendingPhishing}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">{sendingPhishing ? 'Sending...' : 'Send Phishing Test'}</span>
          </Button>
          <Button
            onClick={handleDelete}
            variant="destructive"
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
          <Badge variant={getRiskBadgeVariant(employee.risk_level)} className="text-lg px-4 py-2">
            {employee.risk_level}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Risk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <div className="text-3xl font-bold text-white">{employee.risk_score.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">Out of 100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{employee.incident_count}</div>
            <p className="text-xs text-muted-foreground">Security incidents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Incident</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                {employee.last_incident ? (
                  <div className="text-sm text-white">
                    {new Date(employee.last_incident).toLocaleDateString()}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No incidents</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Employee ID</dt>
              <dd className="mt-1 text-sm text-white font-mono">{employee.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Created At</dt>
              <dd className="mt-1 text-sm text-white">
                {new Date(employee.created_at).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Risk Level</dt>
              <dd className="mt-1">
                <Badge variant={getRiskBadgeVariant(employee.risk_level)}>
                  {employee.risk_level}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Risk Score</dt>
              <dd className="mt-1 text-sm text-white font-semibold">
                {employee.risk_score.toFixed(2)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Risk Score History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {riskHistory.length > 0 ? (
            <div className="space-y-3">
              {riskHistory.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-white">
                      Risk Score: {record.risk_score.toFixed(1)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{record.reason}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(record.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No risk history available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

