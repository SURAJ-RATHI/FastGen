import 'dotenv/config';
import express, { urlencoded } from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import { requireAuth } from './middleware/authMiddleware.js';

const app = express();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3000;

// Validate required environment variables
if (!process.env.SESSION_SECRET) {
  console.error('SESSION_SECRET environment variable is required!');
  process.exit(1);
}

// CORS configuration MUST BE FIRST - before any other middleware or routes
app.use(cors({
    origin: [
        'https://fastgen-ai.vercel.app',
        'https://fastgen.vercel.app',
        process.env.CORS_ORIGIN,
        process.env.VITE_FE_URL
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With', 'Cache-Control'],
    optionsSuccessStatus: 200
}));

// Handle preflight requests explicitly for all routes
app.options('*', cors());



app.use(express.json());
app.use(urlencoded({extended:true}));

// Add logging middleware to see incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin || 'No origin'}`);
  console.log('Headers:', req.headers);
  next();
});

// Test CORS endpoint
app.get('/test-cors', (req, res) => {
    console.log('CORS test endpoint hit - Origin:', req.headers.origin);
    res.json({ 
        message: 'CORS test successful',
        origin: req.headers.origin,
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mount authentication routes
import authRoutes from './routes/auth.js';
app.use('/api/auth', authRoutes);

// Mount user routes
import userRoutes from './routes/user.js';
app.use('/api/user', requireAuth, userRoutes);

// Mount chat routes
import chatRoutes from './routes/chats.js';
app.use('/api/chats', requireAuth, chatRoutes);

// Public route for shared chats (no authentication required)
app.use('/api/shared-chat', chatRoutes);

// Mount other essential routes
import uploadRoutes from './routes/upload.js';
app.use('/api/upload', uploadRoutes);

import geminiRoutes from './routes/gemini.js';
app.use('/api/gemini', requireAuth, geminiRoutes);

import messageRoutes from './routes/messages.js';
app.use('/api/messages', requireAuth, messageRoutes);

import userPrefRoutes from './routes/userPref.js';
app.use('/api/userPref', requireAuth, userPrefRoutes);

import GQUizzesRoutes from './routes/GQuizzes.js';
app.use('/api/GQuizzes', requireAuth, GQUizzesRoutes);

import ytRoutes from './routes/yt.js';
app.use('/api/yt', ytRoutes);

import emailRoutes from './routes/email.js';
app.use('/api/email', emailRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: "FastGen API server running",
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
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
