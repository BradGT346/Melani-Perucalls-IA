import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors()); // Esto quita el error de conexión
app.use(express.static('public')); 

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const PORT = process.env.PORT || 3000;

app.post('/api/chat', async (req, res) => {
    const { userPrompt } = req.body;
    const systemPrompt = "Eres Melanie, una IA amigable y útil.";

    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash", 
            systemInstruction: systemPrompt 
        });

        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        res.json({ response: response.text() });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "No pude conectar con la IA." });
    }
});

app.listen(PORT, () => {
    console.log(`Melanie lista en puerto ${PORT}`);
});
