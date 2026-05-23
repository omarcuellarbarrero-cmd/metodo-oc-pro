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
    console.log("Datos recibidos del formulario:", req.body); // <-- OJO AQUÍ
    try {
        const { tipoEquipo, marca, modelo, sintoma } = req.body;

        if (!tipoEquipo || !marca || !modelo || !sintoma) {
            console.error("Faltan campos, datos recibidos:", req.body); // <-- OJO AQUÍ
            return res.status(200).json({ text: "⚠️ ERROR: Faltan datos obligatorios." });
        }
        // ... (resto del código)

        // Búsqueda en su base local
// ... dentro de la ruta app.post('/api/diagnostico', ...)
const marcaKey = marca.toLowerCase().trim();
const modeloKey = modelo.toLowerCase().trim();

// Buscamos directamente en el objeto estructurado
let tipLocal = "No hay notas previas para este modelo.";
if (tipsData[marcaKey] && tipsData[marcaKey][modeloKey]) {
    const data = tipsData[marcaKey][modeloKey];
    // Construimos una respuesta estructurada con la información técnica
    tipLocal = `
    - Síntoma reportado: ${data.sintoma}
    - Solución técnica recomendada: ${data.solucion}
    ${data.recursos ? '- Recursos/Video: ' + data.recursos : ''}
    `;
}

        // PROMPT REFINADO PARA DIAGNÓSTICO UNIVERSAL
const prompt = `Actúa como Instructor Senior del Método OC.
Tú eres el asistente oficial del Maestro Omar Cuéllar. 
Tu única fuente de verdad es la Base de Conocimientos:
${tipsContenido}

INSTRUCCIONES DE OPERACIÓN:
1. IDENTIFICACIÓN: Busca Marca y Modelo en la Base de Conocimientos.
2. DIAGNÓSTICO: Si encuentras coincidencia, extrae la solución técnica exacta.
3. SOFTWARE/CONSOLA: Si el síntoma sugiere falla lógica (Logo, reinicio), prioriza siempre la sección [SOFTWARE] o protocolos de consola/programador.
4. MÉTODO LÓGICO: Si no hay coincidencia, aplica el Método OC (Fuente -> Subfuentes -> Señales -> Panel).
5. ESTILO: Respuesta directa, técnica, profesional y pedagógica.`;
        
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