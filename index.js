import { GoogleGenerativeAI } from "@google/generative-ai";
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// EL PUENTE AL NUEVO ARCHIVO: Importamos los tips exclusivos
import { tipsContenido } from './tips.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(__dirname));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/diagnostico', async (req, res) => {
    try {
        const { marca, modelo, sintoma, descartes } = req.body;

        if (!marca || !modelo || !sintoma) {
            return res.status(200).json({ text: "⚠️ ERROR EN RECEPCIÓN: Faltan datos técnicos en el reporte enviado desde el buscador." });
        }

        // El prompt ahora se alimenta automáticamente del archivo tips.js
        const prompt = `Actúa como un expertisimo instructor de reparación de televisores modernos. 
        Basándote en estas directrices técnicas del Método OC y base de conocimientos: ${tipsContenido}
        Analiza detalladamente la siguiente falla en banco y provee un diagnóstico estructurado bajo el Método OC:
        MARCA: ${marca} | MODELO: ${modelo} | SÍNTOMA: ${sintoma} | PRUEBAS REALIZADAS: ${descartes || 'Ninguna registrada'}`;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(200).json({ 
                text: "⚠️ FUEGO EN LA FUENTE: El servidor VPS no está detectando la variable GEMINI_API_KEY en Coolify." 
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent(prompt);
        const responseIA = await result.response;
        const textoFinal = responseIA.text();

        return res.status(200).json({ text: textoFinal });

    } catch (error) {
        console.error("DETALLE GENERAL DEL COLAPSO EN EL VPS:", error.message);
        return res.status(500).json({ 
            text: `⚙️ ERROR INTERNO DEL SERVIDOR (COLAPSO MOTOR IA): ${error.message}` 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor PRO operando con éxito y escuchando en puerto ${PORT}`);
});
