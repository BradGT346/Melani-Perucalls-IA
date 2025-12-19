import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Nombre de librería corregido
import cors from 'cors'; // Importante para la conexión

// Configuración del servidor
const app = express();
app.use(express.json());
app.use(cors()); // Permite que el chat se conecte sin errores
app.use(express.static('public')); 

// Configuración de la IA (Usa tu clave de API de Render)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const PORT = process.env.PORT || 3000;

app.post('/api/chat', async (req, res) => {
    const { userPrompt, history } = req.body;

    // Personalidad de Melanie
    const systemPrompt = "Eres Melanie, una asistente de IA amigable y profesional. Ayuda al usuario en todo lo que necesite.";

    try {
        // Usamos el modelo correcto: gemini-1.5-flash
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: systemPrompt 
        });

        // Formateamos el historial si existe, si no, empezamos vacío
        const chat = model.startChat({
            history: history || [],
        });

        const result = await chat.sendMessage(userPrompt);
        const response = await result.response;
        
        res.json({ response: response.text() });

    } catch (error) {
        console.error("Error en Gemini:", error);
        res.status(500).json({ error: "No pude obtener respuesta de la IA." });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor listo en puerto ${PORT}`);
});
