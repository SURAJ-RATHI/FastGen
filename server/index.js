import 'dotenv/config';
import express, { urlencoded } from 'express';
import cors from 'cors';
import connectDB from './config/database.js';

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

// Basic CORS configuration
app.use(cors({
    origin: true, // Allow all origins for testing
    credentials: true
}));

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

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
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
