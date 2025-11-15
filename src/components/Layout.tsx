import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Shield, Users, AlertTriangle, Target, LogOut, BarChart3, Sparkles } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen">
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                  <Shield className="h-5 w-5 text-black" />
                </div>
                <span className="text-xl font-bold text-white">
                  SecureAware
                </span>
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
                <Link
                  to="/"
                  className={`${
                    isActive('/')
                      ? 'bg-white text-black'
                      : 'text-muted-foreground hover:text-white hover:bg-accent'
                  } inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all`}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
                <Link
                  to="/employees"
                  className={`${
                    isActive('/employees')
                      ? 'bg-white text-black'
                      : 'text-muted-foreground hover:text-white hover:bg-accent'
                  } inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all`}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Employees
                </Link>
                <Link
                  to="/campaigns"
                  className={`${
                    isActive('/campaigns')
                      ? 'bg-white text-black'
                      : 'text-muted-foreground hover:text-white hover:bg-accent'
                  } inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all`}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Campaigns
                </Link>
                <Link
                  to="/incidents"
                  className={`${
                    isActive('/incidents')
                      ? 'bg-white text-black'
                      : 'text-muted-foreground hover:text-white hover:bg-accent'
                  } inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all`}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Incidents
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground bg-accent px-3 py-1.5 rounded-lg border border-border">
                {user?.email}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="hover:bg-white hover:text-black"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

