import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors()); 
app.use(express.static('public')); 

// Inicializamos con tu llave de API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const PORT = process.env.PORT || 10000; 

app.post('/api/chat', async (req, res) => {
    const { userPrompt } = req.body;
    try {
        // Usamos el modelo 'gemini-pro', que es el más estable para texto
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        const text = response.text();
        
        res.json({ response: text });
    } catch (error) {
        console.error("DETALLE DEL ERROR:", error);
        res.status(500).json({ error: "No pude conectar con la IA." });
    }
});

app.listen(PORT, () => {
    console.log(`Melanie IA activa en puerto ${PORT}`);
});
