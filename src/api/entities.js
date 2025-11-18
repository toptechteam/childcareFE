import api from '../utils/api';

export const Center = {
  find: async (query = {}) => {
    try {
      const response = await api.get('/centers', { params: query });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  findById: async (id) => {
    try {
      const response = await api.get(`/centers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  create: async (data) => {
    try {
      const response = await api.post('/centers', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  update: async (id, data) => {
    try {
      const response = await api.patch(`/centers/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/centers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export const Template = {
  find: async (query = {}) => {
    try {
      const response = await api.get('/templates', { params: query });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  findById: async (id) => {
    try {
      const response = await api.get(`/templates/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  create: async (data) => {
    try {
      const response = await api.post('/templates', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  update: async (id, data) => {
    try {
      const response = await api.patch(`/templates/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/templates/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export const TestimonialRequest = {
  find: async (query = {}) => {
    try {
      const response = await api.get('/testimonial-requests', { params: query });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  findById: async (id) => {
    try {
      const response = await api.get(`/testimonial-requests/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  create: async (data) => {
    try {
      const response = await api.post('/testimonial-requests', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  update: async (id, data) => {
    try {
      const response = await api.patch(`/testimonial-requests/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/testimonial-requests/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export const Testimonial = {
  find: async (query = {}) => {
    try {
      const response = await api.get('/testimonials', { params: query });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  findById: async (id) => {
    try {
      const response = await api.get(`/testimonials/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  create: async (data) => {
    try {
      const response = await api.post('/testimonials', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  update: async (id, data) => {
    try {
      const response = await api.patch(`/testimonials/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/testimonials/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Auth API
export const User = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getProfile: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  updateProfile: async (userData) => {
    try {
      const response = await api.patch('/auth/me', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/auth/change-password', { currentPassword, newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};