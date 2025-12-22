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

// Servimos el HTML directamente desde la raíz (como estaba antes)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// CONFIGURACIÓN DE PERSONALIDAD Y MEMORIA
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "Tu nombre es Melanie. Eres una asistente virtual inteligente, amable y eficiente. Tienes una personalidad propia: eres servicial, un poco informal pero profesional, y siempre buscas dar la mejor solución. Recuerdas lo que el usuario te dice en la conversación actual."
});

let chatHistory = []; // Aquí se guarda la memoria temporal

app.post('/api/chat', async (req, res) => {
    const { userPrompt } = req.body;
    try {
        const chat = model.startChat({
            history: chatHistory,
        });

        const result = await chat.sendMessage(userPrompt);
        const response = await result.response;
        const text = response.text();

        // Actualizamos la memoria
        chatHistory.push({ role: "user", parts: [{ text: userPrompt }] });
        chatHistory.push({ role: "model", parts: [{ text: text }] });

        res.json({ response: text });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error de conexión" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Melanie activa en puerto ${PORT}`);
});
