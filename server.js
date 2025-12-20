import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors()); 
app.use(express.static('public')); 

// Usamos la API KEY de tus variables de entorno en Render
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const PORT = process.env.PORT || 10000; 

app.post('/api/chat', async (req, res) => {
    const { userPrompt } = req.body;
    try {
        // Forzamos el uso de gemini-1.5-flash sin prefijos de versión
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        res.json({ response: response.text() });
        
    } catch (error) {
        // Esto imprimirá el error real en los logs para nosotros
        console.error("ERROR GOOGLE:", error.message);
        res.status(500).json({ error: "No pude conectar con Melanie" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor activo en puerto ${PORT}`);
});
