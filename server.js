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

// Usamos el nombre exacto de tu llave en Render
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Configuramos el modelo con la personalidad de Melanie
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "Tu nombre es Melanie. Eres una asistente virtual inteligente, amable y profesional. Tienes una personalidad propia y buscas siempre ayudar al usuario de la mejor manera."
});

app.post('/api/chat', async (req, res) => {
    const { userPrompt } = req.body;
    try {
        // Iniciamos el chat sin historial para esta versión simple
        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });
    } catch (error) {
        console.error("Error técnico:", error.message);
        res.status(500).json({ error: "Error de conexión con Melanie" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Melanie funcionando en puerto ${PORT}`);
});
