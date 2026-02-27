const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Basic health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is running' });
});

// Chatbot functionality
app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'Messages array is required and must not be empty' });
        }

        const systemInstruction = 'You are a calming, helpful mindfulness and productivity assistant. Keep responses helpful, empathetic, and concise. Format output cleanly without using markdown wrappers if possible, keep it conversational.';

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: systemInstruction,
        });

        // The messages array from frontend looks like: [{role: 'user', content: '...'}, {role: 'assistant', content: '...'}]
        // Gemini history expects role: 'user' | 'model'
        const latestMessage = messages[messages.length - 1];
        const historyFrames = messages.slice(0, -1).map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content || '' }]
        }));

        const chat = model.startChat({
            history: historyFrames
        });

        const result = await chat.sendMessage([{ text: latestMessage.content || '' }]);
        const text = result.response.text();

        res.json({
            role: 'assistant',
            content: text
        });
    } catch (error) {
        console.error('Error with Gemini API:', error);
        res.status(500).json({ error: 'Internal server error processing the chat request.' });
    }
});

module.exports = app;

// Allow listening locally
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Development API server running on port ${PORT}`);
    });
}
