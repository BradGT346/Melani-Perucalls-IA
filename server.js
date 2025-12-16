import express from 'express';
import { GoogleGenAI } from '@google/genai';

// La clave de API se lee automáticamente de la variable de entorno de Render
const ai = new GoogleGenAI({}); 

const app = express();
app.use(express.json());
// Servimos el frontend (index.html) desde el directorio 'public'
app.use(express.static('public')); 

const PORT = process.env.PORT || 3000;

// La ruta para manejar la comunicación con la IA
app.post('/api/chat', async (req, res) => {
    const { userPrompt, history } = req.body;

    // 1. **CORRECCIÓN CLAVE:** System Prompt ajustado.
    //    Esto es lo que define la personalidad y elimina la referencia a Perucalls.
    const systemPrompt = "Eres Melanie, una asistente de inteligencia artificial amigable, concisa y extremadamente útil. Tu objetivo es responder preguntas, resumir información y ser creativa. Mantén un tono profesional pero cercano. No tienes límites de tema, solo enfócate en ayudar al usuario de la mejor manera posible.";

    // Mapeamos el historial del chat al formato que espera la API de Gemini
    const mappedHistory = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));

    // El último mensaje del usuario
    mappedHistory.push({
        role: 'user',
        parts: [{ text: userPrompt }]
    });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", 
            contents: mappedHistory,
            config: {
                systemInstruction: systemPrompt,
            }
        });

        res.json({ response: response.text });
    } catch (error) {
        console.error("Error al generar contenido con Gemini:", error);
        res.status(500).json({ error: "Error interno del servidor al contactar con la IA." });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor de Melanie IA corriendo en el puerto ${PORT}`);
});
