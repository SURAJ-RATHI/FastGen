import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';
import axios from 'axios';
import { AUTH_STORAGE_KEY, AUTH_ENDPOINTS, AUTH_ERROR_MESSAGES } from '../constants/authConstants';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return null;
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem(AUTH_STORAGE_KEY));

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is authenticated on app load
  useEffect(() => {
    if (token) {
      checkAuthStatus();
    } else {
      setIsLoading(false);
    }
  }, [token, checkAuthStatus]);

  const checkAuthStatus = useCallback(async () => {
    try {
      const userData = await apiService.get(AUTH_ENDPOINTS.ME);
      setUser(userData);
      setIsSignedIn(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      // Token is invalid, clear it
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setToken(null);
      setUser(null);
      setIsSignedIn(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signInWithGoogle = useCallback(async (credential) => {
    try {
      
      const response = await apiService.post(AUTH_ENDPOINTS.GOOGLE, {
        credential
      });
      
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem(AUTH_STORAGE_KEY, newToken);
      setToken(newToken);
      setUser(userData);
      setIsSignedIn(true);
      
      return { success: true };
    } catch (error) {
      console.error('Google sign-in failed:', error);
      
      if (error.code === 'ERR_NETWORK') {
        return { 
          success: false, 
          error: AUTH_ERROR_MESSAGES.NETWORK_ERROR
        };
      }
      
      if (error.response?.status === 403) {
        return { 
          success: false, 
          error: AUTH_ERROR_MESSAGES.ACCESS_DENIED
        };
      }
      
      return { 
        success: false, 
        error: AUTH_ERROR_MESSAGES.SIGNIN_FAILED
      };
    }
  }, []);

  const signInWithEmail = useCallback(async (email, password) => {
    try {
      const response = await apiService.post(AUTH_ENDPOINTS.SIGNIN, {
        email,
        password
      });
      
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem(AUTH_STORAGE_KEY, newToken);
      setToken(newToken);
      setUser(userData);
      setIsSignedIn(true);
      
      return { success: true };
    } catch (error) {
      console.error('Email sign-in failed:', error);
      return { 
        success: false, 
        error: AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS
      };
    }
  }, []);

  const signUpWithEmail = useCallback(async (name, email, password) => {
    try {
      const response = await apiService.post(AUTH_ENDPOINTS.SIGNUP, {
        name,
        email,
        password
      });
      
      if (response.data.success) {
        // Automatically sign in after successful signup
        return await signInWithEmail(email, password);
      }
      
      return { success: false, error: AUTH_ERROR_MESSAGES.SIGNUP_FAILED };
    } catch (error) {
      console.error('Email sign-up failed:', error);
      return { 
        success: false, 
        error: AUTH_ERROR_MESSAGES.SIGNUP_FAILED
      };
    }
  }, [signInWithEmail]);

  const signOut = useCallback(async () => {
    try {
      await apiService.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Sign-out failed:', error);
      // Still clear local data even if server request fails
    } finally {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setToken(null);
      setUser(null);
      setIsSignedIn(false);
    }
  }, []);

  const getUserData = useCallback(async () => {
    try {
      const response = await apiService.get(AUTH_ENDPOINTS.USER_ME);
      return response.data;
    } catch (error) {
      console.error('Failed to get user data:', error);
      throw new Error(AUTH_ERROR_MESSAGES.USER_DATA_FAILED);
    }
  }, []);

  const value = {
    user,
    isLoading,
    isSignedIn,
    userId: user?.id,
    token,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    getUserData,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
