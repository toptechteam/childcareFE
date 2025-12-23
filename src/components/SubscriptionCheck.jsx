import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function SubscriptionCheck({ children }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const allowedPaths = ['/subscription', '/login', '/landing'];
        if (allowedPaths.some(path => location.pathname.startsWith(path))) {
            return;
        }
        if (user && !user.subscription_active && !user.is_superuser) {
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
