import api from '../utils/api';

export const Core = {
  InvokeLLM: async (prompt, options = {}) => {
    try {
      const response = await api.post('/ai/invoke-llm', { prompt, ...options });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  SendEmail: async (to, subject, body, options = {}) => {
    try {
      const response = await api.post('/email/send', { to, subject, body, ...options });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  UploadFile: async (file, options = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        ...options
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  GenerateImage: async (prompt, options = {}) => {
    try {
      const response = await api.post('/ai/generate-image', { prompt, ...options });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  ExtractDataFromUploadedFile: async (fileId, options = {}) => {
    try {
      const response = await api.post(`/files/${fileId}/extract-data`, options);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  CreateFileSignedUrl: async (fileName, options = {}) => {
    try {
      const response = await api.post('/files/signed-url', { fileName, ...options });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  UploadPrivateFile: async (file, options = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/files/upload/private', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        ...options
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export const { 
  InvokeLLM, 
  SendEmail, 
  UploadFile, 
  GenerateImage, 
  ExtractDataFromUploadedFile, 
  CreateFileSignedUrl, 
  UploadPrivateFile 
} = Core;
