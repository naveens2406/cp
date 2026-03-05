import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { authApi } from '../services/apiClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const restoreUser = async () => {
      if (token) {
        try {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            // In a real app, we'd verify the token here. 
            // For mock-only, we'll assume it's valid if present.
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error restoring user:', error);
          logout();
        }
      }
      setLoading(false);
    };

    restoreUser();
  }, [token]);

  const login = async (credentials) => {
    try {
      // credentials should have email and password for the real API
      const response = await authApi.login(credentials.email || credentials.username, credentials.password);
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(token);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      toast.success('Login successful!');
      return { success: true, role: userData.user_type };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      await authApi.register(userData.name, userData.email, userData.phone, userData.password, userData.confirmPassword);
      toast.success('Registration successful! Please login.');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const changeCredentials = async (data) => {
    // Mock implementation
    toast.success('Credentials updated successfully (Mock)');
    return { success: true };
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    changeCredentials,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.user_type === 'admin',
    isCustomer: user?.user_type === 'customer'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
