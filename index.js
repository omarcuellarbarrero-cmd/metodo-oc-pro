import { GoogleGenerativeAI } from "@google/generative-ai";
import express from 'express';
import { tipsContenido } from './tips.js'; 
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Servir la Landing Page cuando entren a la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// El resto de su código (app.post, etc.) se queda igual
const app = express();
app.use(express.json());
app.use(express.static('.'));

app.post('/api/diagnostico', async (req, res) => {
    try {
        const { marca, modelo, sintoma, descartes } = req.body;
        
        // El prompt completo que integra el Método OC
        const prompt = `Actúa como Instructor Senior del Método OC. 
        Base de conocimientos: ${tipsContenido}
        
        Datos del caso: 
        Equipo: TV. Marca: ${marca}. Modelo: ${modelo}. 
        Síntoma: ${sintoma}.
        Descartes realizados: ${descartes}.
        
        Instrucción: Proporciona un diagnóstico técnico lógico y preciso paso a paso.`;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const modelAI = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const result = await modelAI.generateContent(prompt);
        res.json({ text: result.response.text() });
        
    } catch (error) {
        console.error("Error en diagnóstico:", error);
        res.status(500).json({ text: "Error procesando el diagnóstico. Intente nuevamente." });
    }
});
import fs from 'fs';
app.get('/debug', (req, res) => {
    fs.readdir('.', (err, files) => {
        res.json(files);
    });
});
app.listen(process.env.PORT || 3000, '0.0.0.0');