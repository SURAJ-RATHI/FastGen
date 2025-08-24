import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('authToken'));

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
  }, [token]);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BE_BASEURL}/api/auth/me`);
      setUser(response.data);
      setIsSignedIn(true);
    } catch (error) {
      // Token is invalid, clear it
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      setIsSignedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async (credential) => {
    try {
      console.log('Attempting Google sign in to:', `${import.meta.env.VITE_APP_BE_BASEURL}/api/auth/google`);
      
      const response = await axios.post(`${import.meta.env.VITE_APP_BE_BASEURL}/api/auth/google`, {
        credential
      });
      
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setUser(userData);
      setIsSignedIn(true);
      
      return { success: true };
    } catch (error) {
      console.error('Google sign in error:', error);
      
      if (error.code === 'ERR_NETWORK') {
        return { 
          success: false, 
          error: 'Network error - please check your connection or try again later' 
        };
      }
      
      if (error.response?.status === 403) {
        return { 
          success: false, 
          error: 'CORS error - please contact support' 
        };
      }
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Google authentication failed' 
      };
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BE_BASEURL}/api/auth/login`, {
        email,
        password
      });
      
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setUser(userData);
      setIsSignedIn(true);
      
      return { success: true };
    } catch (error) {
      console.error('Email sign in error:', error);
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const signOut = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_APP_BE_BASEURL}/api/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      setIsSignedIn(false);
    }
  };

  const getUserData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BE_BASEURL}/user/me`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    isSignedIn,
    userId: user?.id,
    token,
    signInWithGoogle,
    signInWithEmail,
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
