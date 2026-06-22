import express from 'express';
import { GoogleGenAI } from '@google/generative-ai'; // Ajusta la importación según la versión exacta si es necesario

const app = express();

// Permitir que Express entienda datos en formato JSON
app.use(express.json());

// Servir de manera estática los archivos del frontend (si fuera necesario)
app.use(express.static('public'));

// --- EJEMPLO DE RUTA PARA TU ASISTENTE IA ---
// Cambia o adapta esta ruta según cómo llame tu frontend a la API
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        // El proceso de Vercel tomará la API Key desde las variables de entorno de su panel
        const apiKey = process.env.GEMINI_API_KEY; 
        
        if (!apiKey) {
            return res.status(500).json({ error: "Falta la configuración de la API Key en el servidor." });
        }

        // Aquí inicializas Google Generative AI con tu lógica del Método OC
        // Ejemplo base:
        // const ai = new GoogleGenAI({ apiKey });
        // const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        // const result = await model.generateContent(message);
        // const responseText = result.response.text();

        // Por ahora devolvemos una respuesta de prueba para verificar que el servidor funciona
        res.json({ text: `Backend conectado con éxito. Recibí tu mensaje: "${message}"` });

    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: "Hubo un error al procesar tu solicitud." });
    }
});

// IMPORTANTE PARA VERCEL: Exportar la app en lugar de usar app.listen()
export default app;