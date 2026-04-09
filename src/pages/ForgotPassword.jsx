import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { authAPI } from '@/utils/api';
import { createPageUrl } from '@/utils';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fromNav = location.state?.email;
    if (typeof fromNav === 'string' && fromNav.trim()) {
      setEmail(fromNav.trim());
      return;
    }
    if (user?.email) {
      setEmail((prev) => (prev ? prev : user.email));
    }
  }, [location.state, user?.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: 'Error',
        description: 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with your actual API call
      await authAPI.forgotPassword(email);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setEmailSent(true);
      toast({
        title: 'Email sent',
        description: 'If an account exists with this email, you will receive a password reset link.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send reset email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-[#7ACDE0] text-center">Check your email</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We've sent a password reset link to <span className="font-medium">{email}</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button
              onClick={() => setEmailSent(false)}
              variant="outline"
              className="w-full"
            >
              Resend email
            </Button>
            <Button
              onClick={() =>
                isAuthenticated ? navigate(createPageUrl('Settings')) : navigate('/login')
              }
              variant="ghost"
              className="w-full text-[#7ACDE0] hover:bg-[#7ACDE0]/10"
            >
              {isAuthenticated ? 'Back to settings' : 'Back to login'}
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
          <CardTitle className="text-2xl font-bold text-[#7ACDE0] text-center">Forgot your password?</CardTitle>
          <CardDescription className="text-center text-[#7ACDE0]">
            Enter your email and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-[#7ACDE0] hover:bg-[#6bb8c9] text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send reset link'}
            </Button>
            <div className="text-center text-sm space-y-2">
              {isAuthenticated ? (
                <Link
                  to={createPageUrl('Settings')}
                  className="font-medium text-[#7ACDE0] hover:underline block"
                >
                  Back to settings
                </Link>
              ) : (
                <>
                  <span className="text-gray-600 dark:text-gray-300">Remember your password? </span>
                  <Link to="/login" className="font-medium text-[#7ACDE0] hover:underline">
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
