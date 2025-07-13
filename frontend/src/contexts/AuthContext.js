import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

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
  const [token, setToken] = useState(localStorage.getItem('auth-token'));

  useEffect(() => {
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [token]);

  const checkAuth = async () => {
    try {
      const response = await apiService.me();
      setUser(response.data.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password);
      const { user, token } = response.data;
      
      setUser(user);
      setToken(token);
      localStorage.setItem('auth-token', token);
      
      return { success: true, user };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.message || 'Login gagal' 
      };
    }
  };
  const register = async (name, email, password) => {
    try {
      const response = await apiService.register({
        name,
        email,
        password,
        password_confirmation: password,
        role: 'user' // Set default role "user"
      });

      return { success: true, message: 'Registrasi berhasil!' };
    } catch (error) {
      console.error('Register failed:', error);
      return {
        success: false,
        error: error.message || 'Registrasi gagal',
      };
    }
  };
  const logout = async () => {
    try {
      if (token) {
        await apiService.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth-token');
    }
  };

  const hasRole = (role) => {
    return user && user.role === role;
  };

  const canAccess = (allowedRoles) => {
    return user && allowedRoles.includes(user.role);
  };

  const value = {
    user,
    loading,
    token,
    login,
    register,
    logout,
    hasRole,
    canAccess,
    isAuthenticated: !!user,
    isAdmin: hasRole('admin'),
    isResepsionis: hasRole('resepsionis')
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 