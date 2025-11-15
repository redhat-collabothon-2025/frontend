import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md border-border shadow-2xl bg-card">
        <CardHeader className="space-y-1 flex flex-col items-center pb-8">
          {/* White Hat Logo */}
          <div className="relative w-20 h-20 flex items-center justify-center mb-4">
            {/* Hat brim */}
            <div className="absolute bottom-6 w-20 h-3 bg-white rounded-full shadow-lg"></div>
            {/* Hat crown */}
            <div className="absolute top-3 w-12 h-12 bg-white rounded-t-full shadow-lg"></div>
          </div>
          <CardTitle className="text-4xl font-bold text-white">
            WhiteHat
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            Security Awareness Platform
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-background border-border focus:border-white"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 bg-background border-border focus:border-white"
                required
              />
            </div>
            {error && (
              <div className="text-sm text-white bg-destructive/20 p-3 rounded-lg border border-destructive">
                {error}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full h-11 bg-white text-black hover:bg-gray-200 shadow-lg transition-all" 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

