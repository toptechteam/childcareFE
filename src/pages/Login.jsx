import { useState, useEffect } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both email and password',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: 'Login successful',
          description: 'Welcome back!',
        });
        // Get the redirect path from location state or default to '/dashboard'
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to log in. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-[#7ACDE0] text-center">Welcome back</CardTitle>
          <CardDescription className="text-center text-[#7ACDE0]">
            Enter your email and password to sign in to your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 text-[#7ACDE0]">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-[#7ACDE0] focus:border-[#7ACDE0] focus:ring-0 focus:ring-offset-0 transition-all duration-200 shadow-none"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {/* <a href="#" className="text-sm font-medium text-primary  hover:text-[#7ACDE0] hover:underline">
                  Forgot password?
                </a> */}
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                placeholder="********"
                onChange={(e) => setPassword(e.target.value)}
                className="border-[#7ACDE0] focus:border-[#7ACDE0] focus:ring-0 focus:ring-offset-0 transition-all duration-200 shadow-none"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button c type="submit" className="w-full bg-[#8AE0F2] hover:bg-[#7ACDE0] text-white" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
            <div className="text-sm text-center text-[#7ACDE0] dark:text-[#7ACDE0]">
              Don't have an account?{' '}
              <a href="#" className="font-medium text-primary  hover:text-[#7ACDE0] hover:underline">
                Contact support
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
