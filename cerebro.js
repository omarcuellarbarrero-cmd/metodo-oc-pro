import { GoogleGenerativeAI } from "@google/generative-ai";
import express from 'express';
import fs from 'fs';

const app = express();
app.use(express.json());
app.use(express.static('.'));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "SIN_API_KEY");

app.post('/api/diagnostico', async (req, res) => {
    try {
        // Verificación de seguridad para tips.js
        let tips = "";
        if (fs.existsSync('./tips.js')) {
            tips = fs.readFileSync('./tips.js', 'utf8');
        } else {
            console.error("ALERTA: tips.js no encontrado en la raíz");
        }

        const { marca, modelo, sintoma, descartes, usuario } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Actúa como técnico experto del Método OC. 
        Usa esta base de datos técnica como referencia: ${tips}. 
        Caso del colega ${usuario}: 
        Marca: ${marca}, Modelo: ${modelo}, Síntoma: ${sintoma}, Descartes: ${descartes}. 
        Responde un diagnóstico profesional, lógico y directo.`;

        const result = await model.generateContent(prompt);
        res.json({ text: result.response.text() });
    } catch (err) {
        console.error("ERROR CRÍTICO:", err);
        res.status(500).json({ text: "El sistema está en mantenimiento. Error: " + err.message });
    }
});

app.listen(process.env.PORT || 3000, '0.0.0.0', () => console.log("🚀 Sistema Método OC activo..."));