import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
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
      
      if (error.code === 'ERR_NETWORK') {
        return { 
          success: false, 
        };
      }
      
      if (error.response?.status === 403) {
        return { 
          success: false, 
        };
      }
      
      return { 
        success: false, 
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
      
      return { success: true };
    } catch (error) {
      return { success: false };
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
      
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  };

  const signOut = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_APP_BE_BASEURL}/api/auth/logout`);
    } catch (error) {
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
