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
    } catch {
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
      
      // Preload chat data immediately after successful sign-in
      try {
        console.log('Preloading chat data after sign-in...');
        const chatResponse = await axios.get(`${import.meta.env.VITE_APP_BE_BASEURL}/api/chats/getChat`, {
          withCredentials: true,
        });
        const chats = Array.isArray(chatResponse.data) ? chatResponse.data : chatResponse.data?.chats || [];
        console.log('Preloaded chat data:', chats.length, 'chats');
      } catch (chatError) {
        console.log('Chat preload failed (non-critical):', chatError.message);
      }
      
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
      const response = await axios.post(`${import.meta.env.VITE_APP_BE_BASEURL}/api/auth/signin`, {
        email,
        password
      });
      
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setUser(userData);
      setIsSignedIn(true);
      
      // Preload chat data immediately after successful sign-in
      try {
        console.log('Preloading chat data after email sign-in...');
        const chatResponse = await axios.get(`${import.meta.env.VITE_APP_BE_BASEURL}/api/chats/getChat`, {
          withCredentials: true,
        });
        const chats = Array.isArray(chatResponse.data) ? chatResponse.data : chatResponse.data?.chats || [];
        console.log('Preloaded chat data:', chats.length, 'chats');
      } catch (chatError) {
        console.log('Chat preload failed (non-critical):', chatError.message);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Email sign in error:', error);
      
      if (error.code === 'ERR_NETWORK') {
        return { 
          success: false, 
          error: 'Network error - please check your connection or try again later' 
        };
      }
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Email authentication failed' 
      };
    }
  };

  const signUpWithEmail = async (name, email, password) => {
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
      const response = await axios.get(`${import.meta.env.VITE_APP_BE_BASEURL}/api/user/me`);
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
