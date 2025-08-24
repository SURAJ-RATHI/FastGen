import jwt from 'jsonwebtoken';

// Middleware to check if user is authenticated via JWT
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  jwt.verify(token, process.env.SESSION_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to get user from JWT token (optional authentication)
export const getUser = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.SESSION_SECRET || 'your_jwt_secret', (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  }
  next();
};
