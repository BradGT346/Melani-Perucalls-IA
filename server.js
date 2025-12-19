import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors()); // Permite que el chat se conecte desde cualquier navegador
app.use(express.static('public')); 

// Configuración de la IA usando tu variable de entorno
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const PORT = process.env.PORT || 10000; 

app.post('/api/chat', async (req, res) => {
    const { userPrompt } = req.body;
    try {
        // Modelo estándar para evitar el error 404
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        res.json({ response: response.text() });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: "Error interno de la IA" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor funcionando en puerto ${PORT}`);
});
