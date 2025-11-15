import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Calendar, TrendingUp } from 'lucide-react';

interface EmployeeDetail {
  id: string;
  email: string;
  name: string;
  risk_score: number;
  risk_level: string;
  created_at: string;
  incident_count: number;
  last_incident: string | null;
}

export default function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await api.get(`/api/employees/${id}/`);
        setEmployee(response.data);
      } catch (error) {
        console.error('Error fetching employee:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployee();
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
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Employee not found</div>
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
          <h1 className="text-3xl font-bold text-gray-900">{employee.name}</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {employee.email}
          </p>
        </div>
        <Badge variant={getRiskBadgeVariant(employee.risk_level)} className="text-lg px-4 py-2">
          {employee.risk_level}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">Risk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <div className="text-3xl font-bold">{employee.risk_score.toFixed(1)}</div>
                <p className="text-xs text-gray-500">Out of 100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">Total Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{employee.incident_count}</div>
            <p className="text-xs text-gray-500">Security incidents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">Last Incident</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                {employee.last_incident ? (
                  <div className="text-sm">
                    {new Date(employee.last_incident).toLocaleDateString()}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No incidents</div>
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
              <dt className="text-sm font-medium text-gray-500">Employee ID</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">{employee.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(employee.created_at).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Risk Level</dt>
              <dd className="mt-1">
                <Badge variant={getRiskBadgeVariant(employee.risk_level)}>
                  {employee.risk_level}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Risk Score</dt>
              <dd className="mt-1 text-sm text-gray-900 font-semibold">
                {employee.risk_score.toFixed(2)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

