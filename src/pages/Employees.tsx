import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { employeesService, phishingService } from '@/services';
import type { User } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Users, RefreshCw, Mail, CheckSquare, Square, Plus } from 'lucide-react';

export default function Employees() {
  const [employees, setEmployees] = useState<User[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [recalculating, setRecalculating] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set());
  const [sendingBulk, setSendingBulk] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await employeesService.list();
      const employeesList = response.results || [];
      setEmployees(employeesList);
      setFilteredEmployees(employeesList);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      await employeesService.recalculate();
      await fetchEmployees();
      alert('Risk scores recalculated successfully!');
    } catch (error) {
      console.error('Error recalculating risk scores:', error);
      alert('Failed to recalculate risk scores');
    } finally {
      setRecalculating(false);
    }
  };

  const toggleEmployeeSelection = (employeeId: string) => {
    const newSelected = new Set(selectedEmployees);
    if (newSelected.has(employeeId)) {
      newSelected.delete(employeeId);
    } else {
      newSelected.add(employeeId);
    }
    setSelectedEmployees(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedEmployees.size === filteredEmployees.length) {
      setSelectedEmployees(new Set());
    } else {
      setSelectedEmployees(new Set(filteredEmployees.map(emp => emp.id)));
    }
  };

  const handleBulkPhishing = async () => {
    if (selectedEmployees.size === 0) {
      alert('Please select at least one employee');
      return;
    }

    setSendingBulk(true);
    try {
      const response = await phishingService.bulkSend({
        user_ids: Array.from(selectedEmployees),
        template_type: 'linkedin',
      });
      alert(`Phishing emails sent!\nSent: ${response.sent_count}\nFailed: ${response.failed_count}`);
      setSelectedEmployees(new Set());
    } catch (error) {
      console.error('Error sending bulk phishing:', error);
      alert('Failed to send bulk phishing emails');
    } finally {
      setSendingBulk(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.email) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await employeesService.create({
        name: formData.name,
        email: formData.email,
      });
      setCreateOpen(false);
      setFormData({ name: '', email: '' });
      await fetchEmployees();
      alert('Employee created successfully!');
    } catch (error) {
      console.error('Error creating employee:', error);
      alert('Failed to create employee');
    }
  };

  useEffect(() => {
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
        <div className="flex flex-wrap gap-2">
          {selectedEmployees.size > 0 && (
            <Button
              onClick={handleBulkPhishing}
              disabled={sendingBulk}
              variant="default"
              className="gap-2"
            >
              <Mail className={`h-4 w-4 ${sendingBulk ? 'animate-pulse' : ''}`} />
              <span className="hidden sm:inline">Send Phishing ({selectedEmployees.size})</span>
              <span className="sm:hidden">({selectedEmployees.size})</span>
            </Button>
          )}
          <Button
            onClick={() => setCreateOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create Employee</span>
          </Button>
          <Button
            onClick={toggleSelectAll}
            variant="outline"
            className="gap-2"
          >
            {selectedEmployees.size === filteredEmployees.length && filteredEmployees.length > 0 ? (
              <CheckSquare className="h-4 w-4" />
            ) : (
              <Square className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Select All</span>
          </Button>
          <Button
            onClick={fetchEmployees}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button
            onClick={handleRecalculate}
            disabled={recalculating}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${recalculating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Recalculate</span>
          </Button>
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
          <Card
            key={employee.id}
            className={`border-border bg-card hover:shadow-xl hover:border-white transition-all cursor-pointer group ${
              selectedEmployees.has(employee.id) ? 'ring-2 ring-white' : ''
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    toggleEmployeeSelection(employee.id);
                  }}
                  className="flex-shrink-0 cursor-pointer"
                >
                  {selectedEmployees.has(employee.id) ? (
                    <CheckSquare className="h-6 w-6 text-white" />
                  ) : (
                    <Square className="h-6 w-6 text-muted-foreground hover:text-white transition-colors" />
                  )}
                </div>
                <Link to={`/employees/${employee.id}`} className="flex-1 flex items-center justify-between">
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
                </Link>
              </div>
            </CardContent>
          </Card>
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

      {/* Create Employee Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Employee</DialogTitle>
            <DialogDescription>Add a new employee to the system</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter employee name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter employee email"
                className="mt-1"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleCreate} className="flex-1">
                Create Employee
              </Button>
              <Button onClick={() => setCreateOpen(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

