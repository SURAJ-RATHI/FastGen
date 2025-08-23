import 'dotenv/config';
import express, { urlencoded } from 'express';
import cors from 'cors';
import session from 'express-session';
import connectDB from './config/database.js';
import passport from './auth/googleAuth.js';
import { requireAuth } from './middleware/authMiddleware.js';

const app = express();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(urlencoded({extended:true}));

// CORS configuration for cross-domain authentication
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allow localhost on any port for development
        if (origin.includes('localhost')) {
            return callback(null, true);
        }
        
        // Allow your production frontend domain
        if (origin === process.env.VITE_FE_URL || origin === process.env.CORS_ORIGIN) {
            return callback(null, true);
        }
        
        // Allow Vercel domains in production
        if (process.env.NODE_ENV === 'production' && origin.includes('.vercel.app')) {
            return callback(null, true);
        }
        
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none', // Important for cross-domain (Render to Vercel)
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    domain: process.env.NODE_ENV === 'production' ? undefined : undefined // Don't restrict domain in production
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Auth routes
import authRoutes from './routes/auth.js';
app.use('/api/auth', authRoutes);

import userRoutes from './routes/user.js';
app.use('/user', requireAuth, userRoutes);

import uploadRoutes from './routes/upload.js';
app.use('/upload', uploadRoutes); 

import geminiRoutes from './routes/gemini.js';
app.use('/gemini', requireAuth, geminiRoutes); 

import chatRoutes from './routes/chats.js';
app.use('/chats', requireAuth, chatRoutes);

// Public route for shared chats (no authentication required)
app.use('/shared-chat', chatRoutes); 

import messageRoutes from './routes/messages.js';
app.use('/messages', requireAuth, messageRoutes); 

import userPrefRoutes from './routes/userPref.js';
app.use('/userPref', requireAuth, userPrefRoutes); 

import GQUizzesRoutes from './routes/GQuizzes.js';
app.use('/GQuizzes', GQUizzesRoutes); 

import ytRoutes from './routes/yt.js';
app.use('/yt', ytRoutes); 

import emailRoutes from './routes/email.js';
app.use('/', emailRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: "FastGen API server running",
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
