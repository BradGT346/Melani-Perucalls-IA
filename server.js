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

// Conexión estable con tu llave de Render
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// CONFIGURACIÓN DE MELANIE (Personalidad y Memoria)
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "Tu nombre es Melanie. Eres una asistente virtual inteligente, amable y con mucha personalidad. Eres servicial y recuerdas lo que el usuario te dice en esta conversación."
});

let chatHistory = []; // Aquí guardamos lo que Melanie recuerda

app.post('/api/chat', async (req, res) => {
    const { userPrompt } = req.body;
    try {
        const chat = model.startChat({ history: chatHistory });
        const result = await chat.sendMessage(userPrompt);
        const response = await result.response;
        const text = response.text();

        // Guardamos en memoria
        chatHistory.push({ role: "user", parts: [{ text: userPrompt }] });
        chatHistory.push({ role: "model", parts: [{ text: text }] });

        res.json({ response: text });
    } catch (error) {
        console.error("ERROR EN LOGS:", error.message);
        res.status(500).json({ error: "Error de conexión con Melanie" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Melanie funcionando en puerto ${PORT}`);
});
