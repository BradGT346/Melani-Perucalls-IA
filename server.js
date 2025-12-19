import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors()); 
app.use(express.static('public')); 

// Usamos la variable que configuraste en Render
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const PORT = process.env.PORT || 10000; 

app.post('/api/chat', async (req, res) => {
    const { userPrompt } = req.body;
    try {
        // Nombre del modelo estándar para evitar el error 404
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash" 
        });

        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        res.json({ response: response.text() });
        
    } catch (error) {
        console.error("Error detallado:", error);
        res.status(500).json({ error: "No pude conectar con la IA." });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor funcionando en puerto ${PORT}`);
});
