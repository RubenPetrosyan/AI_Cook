import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(express.json());
app.use(cors());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Vercel will inject this

app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a chef assistant that provides recipe ideas based on given ingredients." },
                    { role: "user", content: userMessage }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json({ reply: response.data.choices[0].message.content });

    } catch (error) {
        console.error('OpenAI API error:', error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch recipe" });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));
