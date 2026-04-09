import axios from "axios";

const AUTH_TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY || "auth_token";
const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY || "refresh_token";

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
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function clearSessionAndRedirectToLogin() {
  try {
    localStorage.removeItem("user");
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    /* ignore */
  }
  const path = window.location.pathname || "";
  if (path === "/login" || path === "/forgot-password" || path === "/reset-password") {
    return;
  }
  window.location.replace(`${window.location.origin}/login`);
}

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = String(error.config?.url || "");
      const isLoginAttempt =
        url.includes("/auth/token/") && !url.includes("/auth/token/refresh/");
      const isPublicPasswordFlow =
        url.includes("/auth/forgot-password") || url.includes("/auth/reset-password");
      if (!isLoginAttempt && !isPublicPasswordFlow) {
        clearSessionAndRedirectToLogin();
      }
    }
    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error) {
  const data = error?.response?.data;
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    if (typeof data.message === "string" && data.message.trim()) return data.message;
    if (typeof data.detail === "string" && data.detail.trim()) return data.detail;
  }
  return error?.message || "Request failed";
}

export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/token/', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password/', {
        email,
      });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  changePassword: async ({ current_password, new_password, confirm_password }) => {
    try {
      const response = await api.post("/auth/change-password/", {
        current_password,
        new_password,
        confirm_password,
      });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  resetPassword: async (modal) => {
    try {
      const response = await api.post('/auth/reset-password/', modal);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  refresh: async () => {
    try {
      const response = await api.get('/auth/token/refresh');
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  syncSubscription: async () => {
    try {
      const response = await api.get("/auth/subscription-sync/");
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  createSubscriptionIntent: async () => {
    try {
      const response = await api.get('/stripe/setup-intent/');
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
  updateSubscriptionStatus: async () => {
    try {
      const response = await api.post('/stripe/subscribe/');
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
  // Add other auth-related API calls here
};

export const usersAPI = {
  getUsers: async () => {
    try {
      const response = await api.get('/users/');
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
  sendUserPasswordReset: async (userId) => {
    try {
      const response = await api.post(`/users/${userId}/send-password-reset/`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
  getCenters: async () => {
    try {
      const response = await api.get('/centers/');
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
  updateCenter: async (id, data) => {
    try {
      const response = await api.patch(`/centers/${id}/`, data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
  resetCenterUsage: async (id) => {
    try {
      const response = await api.post(`/centers/${id}/reset_usage/`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
  extendCenterTrial: async (id, extraDays) => {
    try {
      const response = await api.post(`/centers/${id}/extend_trial/`, { extra_days: extraDays });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  deleteCenter: async (id) => {
    try {
      const response = await api.delete(`/centers/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  updatePackage: async (id, data) => {
    try {
      const response = await api.patch(`/packages/${id}/`, data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
  getTestimonials: async () => {
    try {
      const response = await api.get('/testimonials/');
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
  createCenter: async (data) => {
    try {
      const response = await api.post('/centers/', data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  getPackageList: async () => {
    try {
      const response = await api.get('/packages/');
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  getPublicPackages: async () => {
    try {
      const response = await api.get('/packages/public/');
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  getPackageById: async (id) => {
    try {
      const response = await api.get(`/packages/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },


  createPackage: async (data) => {
    try {
      const response = await api.post('/packages/', data);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  deletePackage: async (id) => {
    try {
      const response = await api.delete(`/packages/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
  // Add other user-related API calls here
};

export default api;
