import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/utils/api';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
          // Clear any partial auth state if token is missing
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

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);
      
      if (!data.access) {
        throw new Error('No access token received');
      }

      // Store tokens
      localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token', data.access);
      if (data.refresh) {
        localStorage.setItem(import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token', data.refresh);
      }
      
      // Store user data
      const userInfo = { 
        ...data.user || data, // Use user object from response if available
        email,
        accessToken: data.access, // Store the access token in user object for easy access
        subscription_active: data.user?.subscription_active || data.subscription_active || false
      };
      
      localStorage.setItem('user', JSON.stringify(userInfo));
      setUser(userInfo);
      
      // Return user info including subscription status
      return userInfo;
    } catch (error) {
      console.error('Login error:', error);
      // Clear any partial auth state on error
      localStorage.removeItem('user');
      localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token');
      localStorage.removeItem(import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token');
      setUser(null);
      
      throw error.response?.data || error.message || 'Login failed';
    }
  };


  const refresh = async (email, password) => {
    try {
      const data = await authAPI.refresh();
      debugger
      if (!data.token) {
        throw new Error('No access token received');
      }

      // Store tokens
      localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token', data.token);
      
      
      // Store user data
      let user=localStorage.getItem('user');
      const userInfo = { 
        ...JSON.parse(user), // Use user object from response if available
        email,
        accessToken: data.token, // Store the access token in user object for easy access
        subscription_active: true 
      };
      
      localStorage.setItem('user', JSON.stringify(userInfo));
      setUser(userInfo);
      
      // Return user info including subscription status
      return userInfo;
    } catch (error) {
      console.error('Login error:', error);
      // Clear any partial auth state on error
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
