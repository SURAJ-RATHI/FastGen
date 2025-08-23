// Middleware to check if user is authenticated
export const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Authentication required' });
};

// Middleware to get user from session
export const getUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.user = req.user;
  }
  next();
};
