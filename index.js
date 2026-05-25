import { GoogleGenerativeAI } from "@google/generative-ai";
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(express.static('.'));

// Cargar la base de conocimientos
const tipsContenido = fs.readFileSync('./tips.js', 'utf8');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/diagnostico', async (req, res) => {
    const { marca, modelo, sintoma, descartes, usuario } = req.body;

    const prompt = `
        Eres el asistente del "Método OC". 
        Usa esta base de datos para diagnosticar: 
        ${tipsContenido}
        
        Caso del colega ${usuario}:
        Marca: ${marca}, Modelo: ${modelo}, Síntoma: ${sintoma}, Descartes: ${descartes}.
        
        Responde con un diagnóstico lógico y profesional. Si el caso está en la base de datos, cíñete a esa solución. Si no, usa el método lógico de bloques.
    `;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        res.json({ text: result.response.text() });
    } catch (err) {
        res.status(500).json({ text: "Error procesando el diagnóstico." });
    }
});

app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
    console.log("🚀 Sistema Método OC activo...");
});