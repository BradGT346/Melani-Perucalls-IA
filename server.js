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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Verificación de seguridad en los logs de Render
if (!process.env.GOOGLE_API_KEY) {
    console.error("❌ ERROR: La variable GOOGLE_API_KEY no está configurada en Render.");
} else {
    console.log("✅ Llave detectada correctamente.");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Usamos el modelo sin especificar versión beta para evitar el error 404
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "Tu nombre es Melanie. Eres una asistente amable, inteligente y con personalidad propia. Recuerdas lo que hablamos."
});

let chatHistory = [];

app.post('/api/chat', async (req, res) => {
    const { userPrompt } = req.body;
    try {
        const chat = model.startChat({ history: chatHistory });
        const result = await chat.sendMessage(userPrompt);
        const text = result.response.text();

        chatHistory.push({ role: "user", parts: [{ text: userPrompt }] });
        chatHistory.push({ role: "model", parts: [{ text: text }] });

        res.json({ response: text });
    } catch (error) {
        console.error("DETALLE DEL ERROR:", error.message);
        res.status(500).json({ error: "Error de comunicación con Melanie." });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Melanie activa en el puerto ${PORT}`);
});
