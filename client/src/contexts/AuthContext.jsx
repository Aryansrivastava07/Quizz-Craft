import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAPI, isAuthenticated, getCurrentUser, removeTokens } from '../utils/api';

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      if (isAuthenticated()) {
        const storedUser = getCurrentUser();
        if (storedUser) {
          setUser(storedUser);
          setIsLoggedIn(true);
          
          // Verify token is still valid by making a request
          try {
            const response = await userAPI.getCurrentUser();
            if (response.success) {
              setUser(response.data.user);
            } else {
              // Token is invalid, clear auth state
              logout();
            }
          } catch (error) {
            // Token is invalid, clear auth state
            logout();
          }
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await userAPI.login(credentials);
      if (response.success) {
        setUser(response.data.user);
        setIsLoggedIn(true);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await userAPI.register(userData);
      if (response.success) {
        return response;
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      if (user?._id) {
        await userAPI.logout(user._id);
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      removeTokens();
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  const value = {
    user,
    isLoggedIn,
    loading,
    login,
    register,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
