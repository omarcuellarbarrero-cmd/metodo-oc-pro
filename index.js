import { GoogleGenerativeAI } from "@google/generative-ai";
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { tipsData } from './tips.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/diagnostico', async (req, res) => {
    try {
        const { tipoEquipo, marca, modelo, sintoma } = req.body;

        if (!marca || !modelo || !sintoma) {
            return res.status(200).json({ text: "⚠️ ERROR: Faltan datos obligatorios." });
        }

        // Búsqueda en su base local
        const marcaKey = marca.toLowerCase().trim();
        const modeloKey = modelo.toLowerCase().trim();
        let tipLocal = "No hay notas previas en tips.js para este modelo.";
        
        if (tipsData[marcaKey] && tipsData[marcaKey][modeloKey]) {
            tipLocal = tipsData[marcaKey][modeloKey];
        }

        // PROMPT REFINADO PARA DIAGNÓSTICO UNIVERSAL
        const prompt = `Eres un Instructor Técnico Senior experto en el Método OC.
        
        CONTEXTO DE LA CONSULTA:
        - TIPO DE EQUIPO: ${tipoEquipo}
        - MARCA: ${marca} | MODELO: ${modelo}
        - SÍNTOMA: ${sintoma}

        INSTRUCCIONES DE DIAGNÓSTICO:
        1. Si el equipo es ${tipoEquipo}, ajusta tu lógica: 
           - Si es TV TRC o Audio, prioriza señales analógicas, voltajes lineales y etapas de potencia.
           - Si es TV LCD/LED, prioriza voltajes T-CON, LVDS y fallas en COF/TAB.
        2. Analiza los siguientes apuntes técnicos locales: ${tipLocal}
        
        DIAGNÓSTICO: Provee una guía estructurada bajo el Método OC. Si detectas enlaces de video o PDF, inclúyelos al final de forma idéntica.`;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return res.status(200).json({ text: "⚠️ Error de configuración: GEMINI_API_KEY no detectada." });

        const genAI = new GoogleGenerativeAI(apiKey);
        const modelAI = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await modelAI.generateContent(prompt);
        const textoFinal = result.response.text();

        return res.status(200).json({ text: textoFinal });

    } catch (error) {
        return res.status(500).json({ text: `⚙️ ERROR DE SISTEMA: ${error.message}` });
    }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Método OC: Diagnóstico Universal activo en puerto ${PORT}`));