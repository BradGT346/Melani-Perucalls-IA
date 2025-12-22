import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

// Servimos el HTML desde la raíz para evitar líos de carpetas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Conexión usando tu variable de Render
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Configuración de Melanie: Personalidad y Modelo estable
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "Tu nombre es Melanie. Eres una asistente virtual con personalidad amable, un poco juguetona y muy inteligente. Recuerdas lo que el usuario te dice para dar respuestas coherentes."
});

let chatHistory = []; // Memoria de Melanie

app.post('/api/chat', async (req, res) => {
    const { userPrompt } = req.body;
    try {
        const chat = model.startChat({ history: chatHistory });
        const result = await chat.sendMessage(userPrompt);
        const response = await result.response;
        const text = response.text();

        // Guardamos en la memoria
        chatHistory.push({ role: "user", parts: [{ text: userPrompt }] });
        chatHistory.push({ role: "model", parts: [{ text: text }] });

        res.json({ response: text });
    } catch (error) {
        console.error("DETALLE TÉCNICO:", error.message);
        res.status(500).json({ error: "No pude conectar con mis sistemas." });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Melanie activa en puerto ${PORT}`);
});
