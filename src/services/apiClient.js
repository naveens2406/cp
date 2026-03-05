// Auth API endpoints
import api from './api';

export const authApi = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (name, email, phone, password, confirmPassword) => {
    const response = await api.post('/auth/register', {
      name,
      email,
      phone,
      password,
      confirmPassword
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Orders API endpoints
export const ordersApi = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders/create', orderData);
    return response.data;
  },

  getOrders: async (page = 1, limit = 20, status = null, search = null) => {
    const params = new URLSearchParams({ page, limit });
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    
    const response = await api.get(`/orders?${params.toString()}`);
    return response.data;
  },

  getUserOrders: async (page = 1, limit = 10) => {
    const response = await api.get(`/orders/my-orders?page=${page}&limit=${limit}`);
    return response.data;
  },

  getOrderById: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  updateOrderStatus: async (orderId, status, notes = '') => {
    const response = await api.patch(`/orders/${orderId}/status`, {
      status,
      notes
    });
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/orders/dashboard/stats');
    return response.data;
  }
};

export default {
  authApi,
  ordersApi
};
