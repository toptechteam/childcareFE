import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ALLOWED_PREFIXES = ['/subscription', '/login', '/landing', '/forgot-password', '/reset-password'];
const POLL_MS = 25_000;

function pathIsAllowed(pathname) {
  return ALLOWED_PREFIXES.some((p) => pathname.startsWith(p));
}

export default function SubscriptionCheck({ children }) {
  const { user, syncSubscriptionFromStripe } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locationRef = useRef(location);
  locationRef.current = location;

  // Sync from Stripe on navigation, then redirect if access should be blocked (avoids stale JWT gap)
  useEffect(() => {
    if (!user || user.is_superuser) return;

    let cancelled = false;
    (async () => {
      const data = await syncSubscriptionFromStripe();
      if (cancelled || !data) return;
      const pathname = locationRef.current.pathname;
      if (pathIsAllowed(pathname)) return;
      if (!data.subscription_active) {
        navigate('/subscription', {
          replace: true,
          state: {
            from: locationRef.current,
            message: 'Please subscribe to continue',
          },
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.is_superuser, location.pathname, syncSubscriptionFromStripe, navigate]);

  // Poll so trial expiry / payment state updates without a full navigation
  useEffect(() => {
    if (!user || user.is_superuser) return;

    const id = setInterval(() => {
      syncSubscriptionFromStripe().then((data) => {
        if (!data) return;
        const pathname = locationRef.current.pathname;
        if (pathIsAllowed(pathname)) return;
        if (!data.subscription_active) {
          navigate('/subscription', {
            replace: true,
            state: {
              from: locationRef.current,
              message: 'Please subscribe to continue',
            },
          });
        }
      });
    }, POLL_MS);

    return () => clearInterval(id);
  }, [user?.id, user?.is_superuser, syncSubscriptionFromStripe, navigate]);

  return children;
}
