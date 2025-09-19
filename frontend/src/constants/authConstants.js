// Authentication constants
export const AUTH_STORAGE_KEY = 'authToken';
export const AUTH_ENDPOINTS = {
  ME: '/api/auth/me',
  GOOGLE: '/api/auth/google',
  SIGNIN: '/api/auth/signin',
  SIGNUP: '/api/auth/signup',
  LOGOUT: '/api/auth/logout',
  USER_ME: '/api/user/me'
};

export const AUTH_ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  ACCESS_DENIED: 'Access denied. Please try again.',
  SIGNIN_FAILED: 'Sign-in failed. Please try again.',
  SIGNUP_FAILED: 'Sign-up failed. Please try again.',
  INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
  USER_DATA_FAILED: 'Failed to fetch user data'
};
