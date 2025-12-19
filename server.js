
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors()); 
app.use(express.static('public')); 

// Inicializamos con tu API Key de las variables de entorno de Render
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const PORT = process.env.PORT || 10000; 

app.post('/api/chat', async (req, res) => {
    const { userPrompt } = req.body;
    try {
        // Usamos la versión específica 'gemini-1.5-flash-8b' para evitar el 404
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash-8b" 
        });

        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        res.json({ response: response.text() });
        
    } catch (error) {
        // Esto nos mostrará el error exacto en los logs si algo falla
        console.error("DETALLE TÉCNICO:", error);
        res.status(500).json({ error: "Error de conexión con Google AI" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor de Melanie activo en puerto ${PORT}`);
});
