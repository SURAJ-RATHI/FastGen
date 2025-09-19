import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_BE_BASEURL || 'https://fastgen-5i9n.onrender.com';

// Create axios instance with professional configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication and logging
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and logging
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Log errors
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      if (window.location.pathname !== '/signIn' && window.location.pathname !== '/signUp') {
        window.location.href = '/signIn';
      }
    } else if (error.response?.status === 403) {
      // Forbidden - show upgrade modal or access denied message
      if (window.showToast) {
        window.showToast('Access denied. Please upgrade your plan.', 'error');
      }
    } else if (error.response?.status === 429) {
      // Rate limited
      if (window.showToast) {
        window.showToast('Too many requests. Please wait a moment.', 'error');
      }
    } else if (error.response?.status >= 500) {
      // Server error
      if (window.showToast) {
        window.showToast('Server error. Please try again later.', 'error');
      }
    } else if (error.code === 'ERR_NETWORK') {
      // Network error
      if (window.showToast) {
        window.showToast('Network error. Please check your connection.', 'error');
      }
    }

    return Promise.reject(error);
  }
);

// Professional API service class
class ApiService {
  // Generic request method
  async request(config) {
    const response = await apiClient(config);
    return response.data;
  }

  // GET request
  async get(url, config = {}) {
    return this.request({ method: 'GET', url, ...config });
  }

  // POST request
  async post(url, data, config = {}) {
    return this.request({ method: 'POST', url, data, ...config });
  }

  // PUT request
  async put(url, data, config = {}) {
    return this.request({ method: 'PUT', url, data, ...config });
  }

  // DELETE request
  async delete(url, config = {}) {
    return this.request({ method: 'DELETE', url, ...config });
  }

  // PATCH request
  async patch(url, data, config = {}) {
    return this.request({ method: 'PATCH', url, data, ...config });
  }

  // Upload file
  async uploadFile(url, file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);

    return this.request({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress,
    });
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;

// Export the axios instance for direct use if needed
export { apiClient };
