import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors()); 
app.use(express.static('public')); 

// Conexión con la llave que configuraste en Render
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const PORT = process.env.PORT || 3000;

app.post('/api/chat', async (req, res) => {
    const { userPrompt } = req.body;
    try {
        // Usamos el nombre de modelo completo para evitar el error 404
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash-latest", 
            systemInstruction: "Eres Melanie, una IA amigable y útil creada para ayudar al usuario." 
        });

        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        res.json({ response: response.text() });
        
    } catch (error) {
        console.error("Error detallado:", error);
        res.status(500).json({ error: "No pude conectar con la IA. Revisa los logs de Render." });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor de Melanie encendido en puerto ${PORT}`);
});
