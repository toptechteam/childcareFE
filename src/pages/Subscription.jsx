import { useState, useEffect } from 'react';
import { Elements, useStripe, useElements, CardElement, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { authAPI, usersAPI } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

// Load Stripe.js asynchronously
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { user, refresh } = useAuth();

  const [loading, setLoading] = useState(false);
  const [pkg, setPkg] = useState(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const data = await usersAPI.getPackageById(user.package_id);
        setPkg(data);
      } catch (error) {
        console.error('Error fetching package:', error);
        toast({
          title: 'Error',
          description: 'Failed to load package details',
          variant: 'destructive',
        });
      }
    };

    if (user?.package_id) {
      fetchPackage();
    }
  }, [user]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }
      debugger
      if (setupIntent.status === 'succeeded') {
        const data = await authAPI.updateSubscriptionStatus({
          payment_method: setupIntent.payment_method,
        });
        toast({
          title: 'Payment method saved',
          description: 'Your payment method has been saved successfully',
        });
        if (data?.stripe?.status == 'active') {
          const resp = refresh().then(() => navigate('/dashboard')).catch((err) => {
            console.error('Error creating subscription intent:', err);
          })
        }



      }
    } catch (err) {
      console.error('Payment error:', err);
      toast({
        title: 'Payment failed',
        description: err.message || 'Failed to save payment method',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7ACDE0]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#7ACDE0]">
              Subscribe to {pkg.name}
            </CardTitle>
            <CardDescription className="text-[#7ACDE0]">
              {pkg.description || 'Complete your subscription'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Plan Details</span>
                <Badge variant="outline" className="bg-[#7ACDE0] text-white">
                  {pkg.price_monthly}/month
                </Badge>
              </div>
              {pkg.features && (
                <ul className="space-y-2 mt-4">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Card details
              </label>
              <div className="border rounded-md p-3">
                <PaymentElement
                  options={{
                    layout: 'tabs',
                    fields: {
                      billingDetails: 'auto',
                    },
                  }}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={!stripe || loading}
              className="w-full bg-[#7ACDE0] hover:bg-[#5ab8cc] text-white"
            >
              {loading ? 'Processing...' : `Subscribe for $${pkg.price_monthly}/month`}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default function Subscription() {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initPayment = async () => {
      try {
        const { client_secret } = await authAPI.createSubscriptionIntent();
        setClientSecret(client_secret);
      } catch (err) {
        console.error('Error initializing payment:', err);
        setError('Failed to initialize payment. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initPayment();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7ACDE0]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-[#7ACDE0] hover:bg-[#5ab8cc] text-white"
            >
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
        },
      }}
    >
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  );
}