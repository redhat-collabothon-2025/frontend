import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Users,
  AlertTriangle,
  Target,
  LogOut,
  BarChart3,
  FileText,
  Cpu,
  User as UserIcon,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Layout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen">
      <nav className="border-b border-border bg-card sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - White Hat */}
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white hidden md:inline">
                <img
                  src="/white-hat.png"
                  alt="White Hat"
                  width={120}
                  height={120}
                  className="inline-block w-12 h-12 mr-2"
                />
                Cerberus
              </span>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className={`${
                  isActive("/")
                    ? "bg-white text-black"
                    : "text-muted-foreground hover:text-white hover:bg-white/10"
                } inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200`}
              >
                <BarChart3 className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Dashboard</span>
              </Link>
              <Link
                to="/employees"
                className={`${
                  isActive("/employees")
                    ? "bg-white text-black"
                    : "text-muted-foreground hover:text-white hover:bg-white/10"
                } inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200`}
              >
                <Users className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Employees</span>
              </Link>
              <Link
                to="/campaigns"
                className={`${
                  isActive("/campaigns")
                    ? "bg-white text-black"
                    : "text-muted-foreground hover:text-white hover:bg-white/10"
                } inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200`}
              >
                <Target className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Campaigns</span>
              </Link>
              <Link
                to="/incidents"
                className={`${
                  isActive("/incidents")
                    ? "bg-white text-black"
                    : "text-muted-foreground hover:text-white hover:bg-white/10"
                } inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200`}
              >
                <AlertTriangle className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Incidents</span>
              </Link>
              <Link
                to="/logs"
                className={`${
                  isActive("/logs")
                    ? "bg-white text-black"
                    : "text-muted-foreground hover:text-white hover:bg-white/10"
                } inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200`}
              >
                <FileText className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Logs</span>
              </Link>
              <Link
                to="/agents"
                className={`${
                  isActive("/agents")
                    ? "bg-white text-black"
                    : "text-muted-foreground hover:text-white hover:bg-white/10"
                } inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200`}
              >
                <Cpu className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Agents</span>
              </Link>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-white/10 transition-all gap-2"
                  >
                    <UserIcon className="h-4 w-4" />
                    <span className="hidden md:inline">{user?.email || 'User'}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-white">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate('/profile')}
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-400 focus:text-red-400"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
      <main className="w-full px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
