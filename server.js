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

// Servimos el HTML desde la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Forzamos la versión estable 'v1' para evitar el error 404 de los logs
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "Tu nombre es Melanie. Eres una asistente amable y eficiente con personalidad propia. Recuerdas lo que hablamos."
});

let chatHistory = [];

app.post('/api/chat', async (req, res) => {
    const { userPrompt } = req.body;
    try {
        const chat = model.startChat({ history: chatHistory });
        const result = await chat.sendMessage(userPrompt);
        const response = await result.response;
        const text = response.text();

        // Guardamos en memoria para que no olvide
        chatHistory.push({ role: "user", parts: [{ text: userPrompt }] });
        chatHistory.push({ role: "model", parts: [{ text: text }] });

        res.json({ response: text });
    } catch (error) {
        console.error("ERROR TÉCNICO:", error.message);
        res.status(500).json({ error: "No pude conectar con Google." });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Melanie activa en puerto ${PORT}`);
});
