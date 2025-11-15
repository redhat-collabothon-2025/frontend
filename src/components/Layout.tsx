import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Shield, Users, AlertTriangle, Target, LogOut, BarChart3, Sparkles, Activity } from 'lucide-react';

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
      <nav className="border-b border-border bg-card sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16">
            <div className="flex overflow-x-auto">
              <div className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2 mr-2 sm:mr-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white flex items-center justify-center transform hover:scale-110 transition-transform">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
                </div>
                <span className="text-base sm:text-xl font-bold text-white hidden sm:inline">
                  SecureAware
                </span>
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-white hidden sm:inline" />
              </div>
              <div className="flex ml-2 sm:ml-8 space-x-1 sm:space-x-2">
                <Link
                  to="/"
                  className={`${
                    isActive('/')
                      ? 'bg-white text-black shadow-lg scale-105'
                      : 'text-muted-foreground hover:text-white hover:bg-white/10'
                  } inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 transform hover:scale-105 relative group`}
                >
                  <BarChart3 className={`h-3 w-3 sm:h-4 sm:w-4 sm:mr-1.5 ${isActive('/') ? '' : 'group-hover:rotate-12 transition-transform'}`} />
                  <span className="hidden sm:inline">Dashboard</span>
                  {isActive('/') && <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-black"></div>}
                </Link>
                <Link
                  to="/employees"
                  className={`${
                    isActive('/employees')
                      ? 'bg-white text-black shadow-lg scale-105'
                      : 'text-muted-foreground hover:text-white hover:bg-white/10'
                  } inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 transform hover:scale-105 relative group`}
                >
                  <Users className={`h-3 w-3 sm:h-4 sm:w-4 sm:mr-1.5 ${isActive('/employees') ? '' : 'group-hover:scale-110 transition-transform'}`} />
                  <span className="hidden sm:inline">Employees</span>
                  {isActive('/employees') && <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-black"></div>}
                </Link>
                <Link
                  to="/campaigns"
                  className={`${
                    isActive('/campaigns')
                      ? 'bg-white text-black shadow-lg scale-105'
                      : 'text-muted-foreground hover:text-white hover:bg-white/10'
                  } inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 transform hover:scale-105 relative group`}
                >
                  <Target className={`h-3 w-3 sm:h-4 sm:w-4 sm:mr-1.5 ${isActive('/campaigns') ? '' : 'group-hover:rotate-45 transition-transform'}`} />
                  <span className="hidden sm:inline">Campaigns</span>
                  {isActive('/campaigns') && <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-black"></div>}
                </Link>
                <Link
                  to="/incidents"
                  className={`${
                    isActive('/incidents')
                      ? 'bg-white text-black shadow-lg scale-105'
                      : 'text-muted-foreground hover:text-white hover:bg-white/10'
                  } inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 transform hover:scale-105 relative group`}
                >
                  <AlertTriangle className={`h-3 w-3 sm:h-4 sm:w-4 sm:mr-1.5 ${isActive('/incidents') ? '' : 'group-hover:animate-pulse'}`} />
                  <span className="hidden sm:inline">Incidents</span>
                  {isActive('/incidents') && <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-black"></div>}
                </Link>
                <Link
                  to="/events"
                  className={`${
                    isActive('/events')
                      ? 'bg-white text-black shadow-lg scale-105'
                      : 'text-muted-foreground hover:text-white hover:bg-white/10'
                  } inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 transform hover:scale-105 relative group`}
                >
                  <Activity className={`h-3 w-3 sm:h-4 sm:w-4 sm:mr-1.5 ${isActive('/events') ? '' : 'group-hover:scale-110 transition-transform'}`} />
                  <span className="hidden sm:inline">Events</span>
                  {isActive('/events') && <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-black"></div>}
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-3">
              <div className="hidden md:block text-xs sm:text-sm text-muted-foreground bg-accent px-2 sm:px-3 py-1.5 rounded-lg border border-border truncate max-w-[120px] sm:max-w-none">
                {user?.email}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hover:bg-white hover:text-black transform hover:scale-105 transition-all px-2 sm:px-4"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-4 px-3 sm:py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

