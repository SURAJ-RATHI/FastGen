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

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BE_BASEURL}/api/auth/me`, {
        withCredentials: true
      });
      setUser(response.data);
      setIsSignedIn(true);
    } catch (error) {
      setUser(null);
      setIsSignedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = () => {
    window.location.href = `${import.meta.env.VITE_APP_BE_BASEURL}/api/auth/google`;
  };

  const signOut = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_APP_BE_BASEURL}/api/auth/logout`, {}, {
        withCredentials: true
      });
      setUser(null);
      setIsSignedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BE_BASEURL}/user/me`, {
        withCredentials: true
      });
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
    signInWithGoogle,
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
