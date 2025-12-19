import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors()); // Esto permite que el chat hable con el servidor
app.use(express.static('public')); 

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const PORT = process.env.PORT || 3000;

app.post('/api/chat', async (req, res) => {
    const { userPrompt } = req.body;
    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash", 
            systemInstruction: "Eres Melanie, una IA amigable y útil." 
        });
        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        res.json({ response: response.text() });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "No pude obtener respuesta de la IA." });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor encendido en puerto ${PORT}`);
});
