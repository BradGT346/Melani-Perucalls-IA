import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors()); 
app.use(express.static('public')); 

// Configuración de la IA con tu llave de Render
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const PORT = process.env.PORT || 10000; 

app.post('/api/chat', async (req, res) => {
    const { userPrompt } = req.body;
    
    if (!userPrompt) {
        return res.status(400).json({ error: "Mensaje vacío" });
    }

    try {
        // Usamos el modelo estable para evitar el error 404 de las versiones beta
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash"
        });

        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        const text = response.text();
        
        res.json({ response: text });

    } catch (error) {
        // Imprime el error exacto en los logs de Render para depuración
        console.error("DETALLE TÉCNICO DEL ERROR:", error.message);
        res.status(500).json({ 
            error: "Error de comunicación con la IA",
            details: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor funcionando en puerto ${PORT}`);
});
