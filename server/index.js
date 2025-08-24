import 'dotenv/config';
import express, { urlencoded } from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import { requireAuth } from './middleware/authMiddleware.js';

const app = express();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(urlencoded({extended:true}));

// Add logging middleware to see incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin || 'No origin'}`);
  next();
});

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
        
        // Allow specific Vercel domain
        if (origin === 'https://fastgen-ai.vercel.app') {
            return callback(null, true);
        }
        
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    optionsSuccessStatus: 200
}));

// Handle preflight requests
app.options('*', cors());

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mount routes in order of specificity (most specific first)
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
app.use('/email', emailRoutes);

// Root route should be last to avoid conflicts
app.get('/', (req, res) => {
  res.json({ 
    message: "FastGen API server running",
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Catch-all route for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  if (err.message === 'Not allowed by CORS') {
    console.log('CORS blocked request from:', req.headers.origin);
    return res.status(403).json({ 
      error: 'CORS blocked', 
      origin: req.headers.origin,
      allowedOrigins: [
        process.env.VITE_FE_URL,
        process.env.CORS_ORIGIN,
        'https://fastgen-ai.vercel.app'
      ]
    });
  }
  
  // Handle route parsing errors
  if (err.message && err.message.includes('pathToRegexpError')) {
    console.error('Route parsing error detected');
    return res.status(500).json({ 
      error: 'Route configuration error',
      details: 'Invalid route pattern detected'
    });
  }
  
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
