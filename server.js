// server.js - Versión Lista para Hosting y Gemini API

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { GoogleGenAI } = require('@google/genai'); 

const app = express();
const PORT = process.env.PORT || 3000;
const DUMMY_DATA_PATH = './datos_de_prueba.json'; 

// ** ⚠️ IMPORTANTE: PEGA TU CLAVE REAL DE GEMINI AQUÍ ⚠️ **
const GEMINI_API_KEY = process.env.GEMINI_API_KEY ; // ¡CAMBIA ESTO!

// Inicializa el cliente de Gemini
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const MODEL_NAME = 'gemini-2.5-flash'; 

// Configuración de Middlewares
app.use(cors()); 
app.use(express.static(__dirname)); 
app.use(express.json()); 

// Función para obtener datos de la Base de Datos simulada (leyendo datos_de_prueba.json)
function getBusinessData() {
    return new Promise((resolve, reject) => {
        fs.readFile(DUMMY_DATA_PATH, 'utf8', (err, data) => {
            if (err) {
                console.error('Error al leer el archivo de datos:', err);
                resolve({ error: 'No se pudo cargar el contexto de datos.' }); 
                return;
            }
            try {
                resolve(JSON.parse(data));
            } catch (e) {
                reject(e);
            }
        });
    });
}

// 1. Endpoint para la interfaz (Sirve index.html)
app.get('/', (req, res) => {
    console.log('-> Alguien pidió la página principal.');
    res.sendFile(__dirname + '/index.html');
});

// 2. API Endpoint: Gestiona la conversación y la llamada a Gemini
app.post('/api/chat', async (req, res) => {
    try {
        const { userPrompt, history } = req.body; 
        
        // --- A. RECUPERACIÓN DE DATOS (R) ---
        const contextData = await getBusinessData();
        const context = JSON.stringify(contextData, null, 2);

        // --- B. CONSTRUCCIÓN del Historial para Gemini ---
        const fullHistory = history.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model', 
            parts: [{ text: msg.text }]
        }));
        
        // Creamos la instrucción de personalidad y RAG (System Instruction)
        const systemInstruction = `
            Tu nombre es **Melani**. Eres una Asistente de IA de Perucalls. Eres amigable, conversacional y altamente eficiente. Tu tono es positivo y profesional.

            **REGLA DE PRIORIDAD:**
            1. Si la conversación es social (chistes, saludos, etc.), o requiere coherencia con el historial, mantén la conversación natural.
            2. Solo si la PREGUNTA DEL USUARIO es claramente una consulta de negocio, utiliza los DATOS DE CONTEXTO.

            **DATOS DE CONTEXTO (Perucalls):**
            ${context}
        `;

        // 3. LLAMADA a GEMINI API
        const chat = ai.chats.create({ 
            model: MODEL_NAME,
            config: {
                systemInstruction: systemInstruction,
            },
            history: fullHistory 
        });
        
        const response = await chat.sendMessage({ message: userPrompt });

        // 4. Devolvemos solo el texto de la respuesta al cliente
        res.json({ response: response.text });

    } catch (error) {
        console.error('Error al comunicarse con Gemini o procesar datos:', error);
        res.status(500).json({ error: 'Error del servidor: Falló la comunicación con la IA.' });
    }
});

app.listen(PORT, '0.0.0.0' , () => {
    console.log(`SERVIDOR WEB DE MELANI ENCENDIDO EN: http://localhost:${PORT}`);
    console.log('¡Ahora usando Gemini API! No necesitas Ollama.');

});

