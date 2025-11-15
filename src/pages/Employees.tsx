import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import type { User } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Users } from 'lucide-react';

export default function Employees() {
  const [employees, setEmployees] = useState<User[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get('/api/employees/');
        setEmployees(response.data.results || response.data);
        setFilteredEmployees(response.data.results || response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    const filtered = employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Employees
          </h1>
          <p className="text-muted-foreground mt-2">Manage and monitor employee security risk</p>
        </div>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 bg-background border-border"
            />
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {filteredEmployees.map((employee) => (
          <Link key={employee.id} to={`/employees/${employee.id}`}>
            <Card className="border-border bg-card hover:shadow-xl hover:border-white transition-all cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white group-hover:text-gray-300 transition-colors">
                        {employee.name}
                      </h3>
                      <Badge variant={getRiskBadgeVariant(employee.risk_level)} className="shadow-sm">
                        {employee.risk_level}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{employee.email}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">
                      {employee.risk_score.toFixed(1)}
                    </div>
                    <p className="text-xs text-muted-foreground">Risk Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <Card className="border-border bg-card">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No employees found</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Try adjusting your search criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

