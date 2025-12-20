import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors()); 
app.use(express.static('public')); 

// Conexión con la llave de Google guardada en Render
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const PORT = process.env.PORT || 10000; 

app.post('/api/chat', async (req, res) => {
    const { userPrompt } = req.body;
    
    if (!userPrompt) {
        return res.status(400).json({ error: "Mensaje vacío" });
    }

    try {
        // Usamos el modelo gemini-1.5-flash de forma directa
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        const text = response.text();
        
        res.json({ response: text });

    } catch (error) {
        // Reporte de error detallado para los logs de Render
        console.error("DETALLE TÉCNICO DEL ERROR:", error.message);
        res.status(500).json({ 
            error: "Error de comunicación con la IA",
            details: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Melanie IA activa en puerto ${PORT}`);
});
