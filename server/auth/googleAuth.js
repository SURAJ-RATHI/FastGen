import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ googleId: profile.id });

    if (user) {
      return done(null, user);
    }

    // Extract name information with fallbacks
    const fullName = profile.displayName || 
                    `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim() || 
                    'User';
    
    const firstName = profile.name?.givenName || fullName.split(' ')[0] || 'User';
    const lastName = profile.name?.familyName || fullName.split(' ').slice(1).join(' ') || '';

    // Create new user with enhanced name data
    user = await User.create({
      googleId: profile.id,
      name: fullName,
      firstName: firstName,
      lastName: lastName,
      email: profile.emails?.[0]?.value || '',
      avatar: profile.photos?.[0]?.value || ''
    });

    console.log('New user created via Google OAuth:', {
      name: fullName,
      email: profile.emails?.[0]?.value,
      googleId: profile.id
    });

    return done(null, user);
  } catch (error) {
    console.error('Google OAuth error:', error);
    return done(error, null);
  }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
