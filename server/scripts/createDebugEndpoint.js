import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();

// CORS configuration
app.use(cors({
    origin: [
        'https://fastgen-ai.vercel.app',
        'https://fastgen.vercel.app',
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With', 'Cache-Control'],
    optionsSuccessStatus: 200
}));

app.use(express.json());

// Debug endpoint to test frontend connection
app.get('/debug-frontend', (req, res) => {
    console.log('=== DEBUG ENDPOINT HIT ===');
    console.log('Origin:', req.headers.origin);
    console.log('User-Agent:', req.headers['user-agent']);
    console.log('Headers:', req.headers);
    
    res.json({
        success: true,
        message: 'Frontend can reach backend!',
        timestamp: new Date().toISOString(),
        origin: req.headers.origin,
        backend_url: 'https://fastgen-5i9n.onrender.com',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Test payment endpoint
app.post('/debug-payment', (req, res) => {
    console.log('=== DEBUG PAYMENT ENDPOINT HIT ===');
    console.log('Body:', req.body);
    console.log('Origin:', req.headers.origin);
    
    res.json({
        success: true,
        message: 'Payment endpoint accessible!',
        received_data: req.body,
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Debug server running on port ${PORT}`);
    console.log(`Test URLs:`);
    console.log(`- GET  http://localhost:${PORT}/debug-frontend`);
    console.log(`- POST http://localhost:${PORT}/debug-payment`);
});
