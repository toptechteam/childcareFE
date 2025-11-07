import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/token/', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  // Add other auth-related API calls here
};

export const usersAPI = {
  getUsers: async () => {
    try {
      const response = await api.get('/users/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getCenters: async () => {
    try {
      const response = await api.get('/centers/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getTestimonials: async () => {
    try {
      const response = await api.get('/testimonials/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  createCenter: async (data) => {
    try {
      const response = await api.post('/centers/', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getPackageList: async () => {
    try {
      const response = await api.get('/packages/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createPackage: async (data) => {
    try {
      const response = await api.post('/packages/', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  // Add other user-related API calls here
};

export default api;
