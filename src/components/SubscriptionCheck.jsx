import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function SubscriptionCheck({ children }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Skip check for these routes
        const allowedPaths = ['/subscription', '/login', '/landing'];
        if (allowedPaths.some(path => location.pathname.startsWith(path))) {
            return;
        }
        debugger
        // If user is authenticated but doesn't have an active subscription
        if (user && !user.subscription_active && !user.is_superuser) {
            // Store the current location to redirect back after subscription
            navigate('/subscription', {
                state: {
                    from: location,
                    message: 'Please subscribe to continue'
                }
            });
        }
    }, [user, location, navigate]);

    return children;
}
