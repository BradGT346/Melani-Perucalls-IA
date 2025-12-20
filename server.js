import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors()); 
app.use(express.static('public')); 

// Configuración de Seguridad y API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const PORT = process.env.PORT || 10000; 

app.post('/api/chat', async (req, res) => {
    const { userPrompt } = req.body;
    
    if (!userPrompt) {
        return res.status(400).json({ error: "No enviaste un mensaje" });
    }

    try {
        // Usamos gemini-1.5-flash que es el más rápido actualmente
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        const text = response.text();
        
        res.json({ response: text });
    } catch (error) {
        // Log detallado para Render
        console.error("DETALLE TÉCNICO DEL ERROR:", error.message);
        res.status(500).json({ 
            error: "Error interno en el servidor",
            details: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Melanie IA funcionando en puerto ${PORT}`);
});
