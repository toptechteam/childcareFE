import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '@/utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const persistUser = useCallback((next) => {
    localStorage.setItem('user', JSON.stringify(next));
    setUser(next);
  }, []);

  // Check for existing session on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
          } catch (error) {
            console.error('Failed to parse user data', error);
            localStorage.removeItem('user');
          }
        } else {
          // Clear any partial auth state when token is missing
          localStorage.removeItem('user');
          localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token');
          localStorage.removeItem(import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const syncSubscriptionFromStripe = useCallback(async () => {
    try {
      const data = await authAPI.syncSubscription();
      setUser((prev) => {
        if (!prev) return prev;
        const next = {
          ...prev,
          subscription_active: Boolean(data.subscription_active),
          subscription_status: data.subscription_status ?? prev.subscription_status,
          trial_active: Boolean(data.trial_active),
          trial_end_date: data.trial_end_date ?? prev.trial_end_date,
        };
        localStorage.setItem('user', JSON.stringify(next));
        return next;
      });
      return data;
    } catch (e) {
      console.error('Subscription sync failed', e);
      return null;
    }
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);
      
      if (!data.access) {
        throw new Error('No access token received');
      }

      localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token', data.access);
      if (data.refresh) {
        localStorage.setItem(import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token', data.refresh);
      }
      
      const userInfo = { 
        ...(data.user || {}),
        email,
        accessToken: data.access,
        subscription_active: Boolean(
          data.subscription_active ?? data.user?.subscription_active ?? false
        ),
        subscription_status: data.subscription_status ?? data.user?.subscription_status,
        trial_active: Boolean(data.trial_active ?? data.user?.trial_active),
        trial_end_date: data.trial_end_date ?? data.user?.trial_end_date,
        center_id: data.center_id ?? data.user?.center_id,
        role: data.role ?? data.user?.role,
        is_superuser: data.is_superuser ?? data.user?.is_superuser,
        is_staff: data.is_staff ?? data.user?.is_staff,
        first_name: data.first_name ?? data.user?.first_name,
        last_name: data.last_name ?? data.user?.last_name,
      };
      
      persistUser(userInfo);
      return userInfo;
    } catch (error) {
      console.error('Login error:', error);
      localStorage.removeItem('user');
      localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token');
      localStorage.removeItem(import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token');
      setUser(null);
      
      throw error.response?.data || error.message || 'Login failed';
    }
  };

  const refresh = async () => {
    try {
      const data = await authAPI.refresh();
      if (!data.token) {
        throw new Error('No access token received');
      }

      localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token', data.token);
      
      let prev = {};
      try {
        prev = JSON.parse(localStorage.getItem('user') || '{}');
      } catch {
        prev = {};
      }

      const userInfo = { 
        ...prev,
        accessToken: data.token,
        subscription_active: Boolean(
          data.subscription_active ?? prev.subscription_active ?? false
        ),
        subscription_status: data.subscription_status ?? prev.subscription_status,
        trial_active: Boolean(data.trial_active ?? prev.trial_active),
        trial_end_date: data.trial_end_date ?? prev.trial_end_date,
      };
      
      persistUser(userInfo);
      return userInfo;
    } catch (error) {
      console.error('Token refresh error:', error);
      localStorage.removeItem('user');
      localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token');
      localStorage.removeItem(import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token');
      setUser(null);
      
      throw error.response?.data || error.message || 'Login failed';
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token');
      localStorage.removeItem(import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token');
      setUser(null);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };

  const value = {
    user,
    isLoading,
    login,
    refresh,
    logout,
    syncSubscriptionFromStripe,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
