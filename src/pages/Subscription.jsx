import { useState, useEffect } from 'react';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { authAPI, usersAPI } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';

// Load Stripe.js asynchronously
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const { user } = useAuth();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [packages, setPackage] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
      debugger
      // Create subscription
      await authAPI.createSubscriptionIntent({
        paymentMethodId: paymentMethod.id,
      });

      // Update subscription status
      await authAPI.updateSubscriptionStatus();

      toast({
        title: 'Subscription successful!',
        description: 'Your subscription has been activated.',
      });

      // Redirect to the intended page or dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Subscription error:', err);
      setError(err.message || 'An error occurred while processing your subscription');
      toast({
        title: 'Error',
        description: err.message || 'Failed to process subscription. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (!packages)
    {
      fetchpackage()
    }
  }, []);


  const fetchpackage = async () => {
    debugger
    const pack = await usersAPI.getPackageById(user?.package_id)
    setPackage(pack)

  }


  const cardStyle = {
    style: {
      base: {
        color: '#1a1a1a',
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#7ACDE0]">Subscribe to {packages.name}</CardTitle>
          <CardDescription className="text-[#7ACDE0]">
            Get access to all premium features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium"> {packages.name} - {packages.price_monthly}/{user.subscription_type}</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>  {packages.testimonials_limit} Testimonials</li>
              <li>{packages.video_duration_limit}mb Vidoe</li>
              {/* <li>{packages.name}</li> */}
              <li>And more...</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <CardElement options={cardStyle} />
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={!stripe || isLoading}
            className="w-full bg-[#7ACDE0] hover:bg-[#5ab8cc] text-white"
          >
            {isLoading ? 'Processing...' : 'Subscribe Now'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default function Subscription() {
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const createSubscriptionIntent = async () => {
      try {
        const { client_secret } = await authAPI.createSubscriptionIntent();
        setClientSecret(client_secret);
      } catch (err) {
        console.error('Error creating subscription intent:', err);
        setError('Failed to initialize payment. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    createSubscriptionIntent();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7ACDE0]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-500">Error</CardTitle>
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      {clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: 'stripe',
            },
          }}
        >
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}