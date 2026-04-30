require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { protect } = require('./middleware/authMiddleware');

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

// Root route — Vercel expects a response at `/`
app.get('/', (req, res) => {
    res.send('Backend running 🚀');
});

// Safe DB connect: start server tasks without crashing the whole app
const startServer = async () => {
    try {
        await connectDB();
        console.log('DB connected');
    } catch (err) {
        console.error('DB FAILED:', err.message);
    }
};

startServer();

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('CORS blocked for this origin'));
    },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Test route - defined FIRST
app.get('/api/test', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is working' });
});

// Direct chat test (auth protected)
app.post('/api/chat-test', protect, async (req, res) => {
    try {
        const OpenAI = require('openai');
        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({ error: 'API key missing' });
        }

        const client = new OpenAI({
            baseURL: 'https://api.groq.com/openai/v1',
            apiKey: process.env.GROQ_API_KEY,
        });
        const response = await client.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: req.body.message || 'Hello' }],
            max_tokens: 50,
            temperature: 0.7
        });
        res.json({ reply: response.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Register all API routes
try {
    app.use('/api/auth', require('./routes/authRoutes'));
    console.log('authRoutes loaded');
} catch(e) { console.error('authRoutes FAILED:', e.message); }

try {
    app.use('/api/users', require('./routes/userRoutes'));
    console.log('userRoutes loaded');
} catch(e) { console.error('userRoutes FAILED:', e.message); }

try {
    app.use('/api/projects', require('./routes/projectRoutes'));
    console.log('projectRoutes loaded');
} catch(e) { console.error('projectRoutes FAILED:', e.message); }

try {
    app.use('/api/tasks', require('./routes/taskRoutes'));
    console.log('taskRoutes loaded');
} catch(e) { console.error('taskRoutes FAILED:', e.message); }

try {
    app.use('/api/chat', require('./routes/chatRoutes'));
    console.log('chatRoutes loaded');
} catch(e) { console.error('chatRoutes FAILED:', e.message); }

// Global error handler
app.use((err, req, res, next) => {
    console.error('=== GLOBAL ERROR HANDLER ===');
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({ error: 'Internal server error', details: err.message });
});

const PORT = process.env.PORT || 5000;

// When deployed to Vercel, the platform expects the server to export the app
// and handle the listening itself. Only start the listener in non-production
// (local development) environments to avoid conflicts.
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the Express app for serverless platforms (Vercel)
// Project uses CommonJS modules (`type: commonjs` in package.json), so
// use `module.exports = app`.
module.exports = app;
