import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors()); 
app.use(express.static('public')); 

// Verifica que en Render la variable se llame GOOGLE_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const PORT = process.env.PORT || 3000;

app.post('/api/chat', async (req, res) => {
    const { userPrompt } = req.body;
    try {
        // Usamos el nombre técnico que siempre funciona
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash" 
        });

        // Cambiamos generateContent por una forma más directa
        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        const text = response.text();
        
        res.json({ response: text });
        
    } catch (error) {
        console.error("Error en la IA:", error);
        res.status(500).json({ error: "Error de comunicación con Google Gemini." });
    }
});

app.listen(PORT, () => {
    console.log(`Melanie IA activa en puerto ${PORT}`);
});
