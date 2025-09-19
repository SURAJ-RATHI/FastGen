import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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

  // Configure axios defaults - memoized to prevent unnecessary re-runs
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is authenticated on app load - optimized with useCallback
  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BE_BASEURL}/api/auth/me`);
      setUser(response.data);
      setIsSignedIn(true);
    } catch {
      // Token is invalid, clear it
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      setIsSignedIn(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      checkAuthStatus();
    } else {
      setIsLoading(false);
    }
  }, [token, checkAuthStatus]);


  const signInWithGoogle = useCallback(async (credential) => {
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
  }, []);

  const signInWithEmail = useCallback(async (email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BE_BASEURL}/api/auth/signin`, {
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
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  }, []);

  const signUpWithEmail = useCallback(async (name, email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BE_BASEURL}/api/auth/signup`, {
        name,
        email,
        password
      });
      
      if (response.data.success) {
        // Automatically sign in after successful signup
        return await signInWithEmail(email, password);
      }
      
      return { success: false, error: 'Signup failed' };
    } catch (error) {
      console.error('Email signup error:', error);
      return { success: false, error: error.response?.data?.error || 'Signup failed' };
    }
  }, [signInWithEmail]);

  const signOut = useCallback(async () => {
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
  }, []);

  const getUserData = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BE_BASEURL}/api/user/me`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      throw error;
    }
  }, []);

  const value = useMemo(() => ({
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
  }), [user, isLoading, isSignedIn, token, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, getUserData, checkAuthStatus]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
