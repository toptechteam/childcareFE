import { useState, useEffect, useMemo } from 'react';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { authAPI, usersAPI } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

const STRIPE_PUBLISHABLE_KEY = (import.meta.env.VITE_STRIPE_PUBLIC_KEY || '').trim();

function useStripePublishableReady() {
  const stripePromise = useMemo(
    () => (STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : Promise.resolve(null)),
    []
  );
  const [stripeLoadState, setStripeLoadState] = useState(
    () => (STRIPE_PUBLISHABLE_KEY ? 'loading' : 'missing_key')
  );

  useEffect(() => {
    if (!STRIPE_PUBLISHABLE_KEY) return;
    let cancelled = false;
    stripePromise.then((stripe) => {
      if (cancelled) return;
      if (!stripe) {
        setStripeLoadState('failed');
        return;
      }
      setStripeLoadState('ready');
    });
    return () => {
      cancelled = true;
    };
  }, [stripePromise]);

  return { stripePromise, stripeLoadState };
}

/** Isolate Elements so `options` stay referentially stable unless `clientSecret` changes (Stripe forbids mutating clientSecret). */
function SubscriptionElements({ stripePromise, clientSecret }) {
  const elementsOptions = useMemo(
    () => ({
      clientSecret,
      appearance: { theme: 'stripe' },
    }),
    [clientSecret]
  );

  return (
    <Elements stripe={stripePromise} options={elementsOptions}>
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  );
}

function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { user, refresh } = useAuth();

  const [loading, setLoading] = useState(false);
  const [pkg, setPkg] = useState(null);
  const [pkgError, setPkgError] = useState(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const data = await usersAPI.getPackageById(user.package_id);
        setPkg(data);
        setPkgError(null);
      } catch (error) {
        console.error('Error fetching package:', error);
        setPkgError('Failed to load package details. Please try again.');
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
      if (setupIntent.status === 'succeeded') {
        const data = await authAPI.updateSubscriptionStatus();
        toast({
          title: 'Payment method saved',
          description: 'Your payment method has been saved successfully',
        });
        if (data?.message == 'Subscription purchased and charged successfully via Stripe') {
          refresh()
            .then(() => navigate('/dashboard'))
            .catch((err) => {
              console.error('Error creating subscription intent:', err);
            });
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

  if (pkgError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
            <CardDescription>{pkgError}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => window.location.reload()} className="w-full bg-[#7ACDE0] hover:bg-[#5ab8cc] text-white">
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

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
                    // Avoid showing additional payment methods (e.g. Klarna/Link) as selectable tabs.
                    // Backend also restricts SetupIntent to card-only.
                    layout: 'accordion',
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
  const { stripePromise, stripeLoadState } = useStripePublishableReady();
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (stripeLoadState === 'missing_key' || stripeLoadState === 'failed') {
      setLoading(false);
      return;
    }
    if (stripeLoadState !== 'ready') {
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const { client_secret } = await authAPI.createSubscriptionIntent();
        if (cancelled) return;
        if (!client_secret) {
          setError(
            'Payment setup did not return a client secret. Check backend Stripe configuration.'
          );
          return;
        }
        setClientSecret((prev) => prev ?? client_secret);
      } catch (err) {
        if (!cancelled) {
          console.error('Error initializing payment:', err);
          setError('Failed to initialize payment. Please try again.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [stripeLoadState]);

  if (stripeLoadState === 'missing_key') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Payments not configured</CardTitle>
            <CardDescription className="text-left space-y-2">
              <p>
                The Stripe publishable key is missing. Set{' '}
                <code className="text-xs bg-muted px-1 rounded">VITE_STRIPE_PUBLIC_KEY</code> in
                the environment used when you build the frontend, then redeploy.
              </p>
              <p className="text-sm text-muted-foreground">
                Vite bakes this in at build time (it is not read from the server at runtime).
              </p>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (stripeLoadState === 'failed') {
    const isInsecure =
      typeof window !== 'undefined' &&
      window.location.protocol !== 'https:' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1';
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Stripe did not load</CardTitle>
            <CardDescription className="text-left space-y-2">
              <p>
                Check that <code className="text-xs bg-muted px-1 rounded">VITE_STRIPE_PUBLIC_KEY</code>{' '}
                is a valid <code className="text-xs">pk_live_...</code> or{' '}
                <code className="text-xs">pk_test_...</code> key for this site.
              </p>
              {isInsecure ? (
                <p className="text-sm text-amber-700">
                  Stripe usually requires <strong>HTTPS</strong> on non-localhost sites. Serve this app
                  over HTTPS or use localhost for development.
                </p>
              ) : null}
              <p className="text-sm text-muted-foreground">
                If the form is blank, your host may be blocking scripts or frames (CSP). Allow{' '}
                <code className="text-xs">https://js.stripe.com</code> in script-src and frame-src.
              </p>
            </CardDescription>
          </CardHeader>
        </Card>
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

  if (stripeLoadState === 'loading' || loading || !clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7ACDE0]"></div>
      </div>
    );
  }

  return (
    <SubscriptionElements
      key={clientSecret}
      stripePromise={stripePromise}
      clientSecret={clientSecret}
    />
  );
}