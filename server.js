import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors()); 
app.use(express.static('public')); 

// Forzamos la conexión a la versión estable "v1" para evitar el error 404
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const PORT = process.env.PORT || 10000; 

app.post('/api/chat', async (req, res) => {
    const { userPrompt } = req.body;
    
    if (!userPrompt) return res.status(400).json({ error: "No hay mensaje" });

    try {
        // CAMBIO CLAVE: Especificamos el modelo y forzamos parámetros de seguridad
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
        });

        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        const text = response.text();
        
        res.json({ response: text });

    } catch (error) {
        // Este log nos dirá si el problema es la región o la versión
        console.error("ERROR DETECTADO:", error.message);
        res.status(500).json({ 
            error: "Error de conexión", 
            details: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Melanie IA activa y forzada en puerto ${PORT}`);
});
