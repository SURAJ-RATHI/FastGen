import express from 'express';
import passport from '../auth/googleAuth.js';

const router = express.Router();

// Google OAuth routes
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    accessType: 'offline',
    prompt: 'consent'
  })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/signin' }),
  (req, res) => {
    // Successful authentication, redirect directly to main app
    const frontendUrl = process.env.VITE_FE_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/main`);
  }
);

// Logout route
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  });
});

// Get current user
router.get('/me', (req, res) => {
  console.log('Auth check - Session:', req.session);
  console.log('Auth check - User:', req.user);
  console.log('Auth check - isAuthenticated:', req.isAuthenticated());
  
  if (req.isAuthenticated()) {
    console.log('User authenticated, returning user data');
    res.json(req.user);
  } else {
    console.log('User not authenticated, returning 401');
    res.status(401).json({ error: 'Not authenticated' });
  }
});

export default router;
