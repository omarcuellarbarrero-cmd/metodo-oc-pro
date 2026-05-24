import { GoogleGenerativeAI } from "@google/generative-ai";
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { tipsContenido } from './tips.js'; // Conexión perfecta

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/diagnostico', async (req, res) => {
    try {
        const { tipoEquipo, marca, modelo, sintoma } = req.body;
        
        const prompt = `Actúa como Instructor Senior del Método OC. 
        Base de conocimientos: ${tipsContenido}
        Equipo: ${tipoEquipo}. Marca: ${marca}. Modelo: ${modelo}. Síntoma: ${sintoma}.
        Instrucciones: Prioriza la coincidencia en la Base de Conocimientos. Si es software, guía sobre consola/UART. Si no hay datos, aplica el Método OC lógico.`;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const modelAI = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await modelAI.generateContent(prompt);
        
        res.json({ text: result.response.text() });
    } catch (error) {
        res.status(500).json({ text: "Error de sistema: " + error.message });
    }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log("Método OC Activo en puerto " + PORT));