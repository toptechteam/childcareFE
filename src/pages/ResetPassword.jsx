import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { authAPI } from '@/utils/api';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  // Check if token is valid when component mounts
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidToken(false);
        return;
      }

      try {
        // TODO: Replace with your actual token validation API call
        // const response = await fetch(`/api/auth/validate-reset-token?token=${token}`);
        // const data = await response.json();
        // if (!response.ok) throw new Error(data.message || 'Invalid or expired token');

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // If we get here, token is valid
        setIsValidToken(true);
      } catch (error) {
        console.error('Token validation error:', error);
        setIsValidToken(false);
        toast({
          title: 'Error',
          description: 'This password reset link is invalid or has expired.',
          variant: 'destructive',
        });
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: 'Error',
        description: 'Password must be at least 8 characters long',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with your actual API call
      debugger
      let modal = { token, password }
      const response = await authAPI.resetPassword(modal)
      const data = await response.json();
      if (!response.ok) {
        toast({
          title: 'Error',
          description: data.message || 'Failed to reset password',
        });
      }
      else {
        toast({
          title: 'Success',
          description: 'Your password has been reset successfully!',
        });
        navigate('/login');
      }

    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reset password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-[#7ACDE0] text-center">Invalid Reset Link</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This password reset link is invalid or has expired.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please request a new password reset link.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button
              onClick={() => navigate('/forgot-password')}
              className="w-full bg-[#7ACDE0] hover:bg-[#6bb8c9] text-white"
            >
              Request new reset link
            </Button>
            <Button
              onClick={() => navigate('/login')}
              variant="ghost"
              className="w-full text-[#7ACDE0] hover:bg-[#7ACDE0]/10"
            >
              Back to login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-[#7ACDE0] text-center">Create new password</CardTitle>
          <CardDescription className="text-center text-[#7ACDE0]">
            Your new password must be different from previous passwords
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-[#7ACDE0] focus:border-[#7ACDE0] focus:ring-0 focus:ring-offset-0 transition-all duration-200 shadow-none"
                required
                minLength={8}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Must be at least 8 characters long
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border-[#7ACDE0] focus:border-[#7ACDE0] focus:ring-0 focus:ring-offset-0 transition-all duration-200 shadow-none"
                required
                minLength={8}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-[#7ACDE0] hover:bg-[#6bb8c9] text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting password...' : 'Reset password'}
            </Button>
            <div className="text-center text-sm">
              <span className="text-gray-600 dark:text-gray-300">Remember your password? </span>
              <Link to="/login" className="font-medium text-[#7ACDE0] hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
