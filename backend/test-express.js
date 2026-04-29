const express = require('express');
const app = express();
app.use(express.json());

app.get('/api/test', (req, res) => {
    res.json({ status: 'ok', message: 'Express is working' });
});

app.post('/api/chat-test', async (req, res) => {
    try {
        const Groq = require('groq-sdk');
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const response = await groq.chat.completions.create({
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

app.listen(5555, () => console.log('Test server on port 5555'));
