import { GoogleGenerativeAI } from "@google/generative-ai";
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
// 🔌 EL PUENTE: Conectamos el servidor con su base de datos local de tips
import { tipsData } from './tips.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Permitir que el servidor entienda datos en formato JSON nativo
app.use(express.json());

// Servir la carpeta raíz de forma pública para cargar estilos e imágenes
app.use(express.static(__dirname));

// Bypass de seguridad CORS para evitar bloqueos de transmisión
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

// RUTA PRINCIPAL: Carga de forma directa el buscador (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// RUTA POST: Procesa el diagnóstico combinando sus Tips Propios + Cerebro de Gemini
app.post('/api/diagnostico', async (req, res) => {
    try {
        const { marca, modelo, sintoma, descartes } = req.body;

        if (!marca || !modelo || !sintoma) {
            return res.status(200).json({ text: "⚠️ ERROR EN RECEPCIÓN: Faltan datos técnicos obligatorios." });
        }

        // 🔍 EXTRACTOR INTELIGENTE: Buscamos si el modelo exacto existe en su tips.js
        const marcaKey = marca.toLowerCase().trim();
        const modeloKey = modelo.toLowerCase().trim();
        
        let tipLocal = "No hay notas específicas previas en tips.js para este modelo.";
        
        if (tipsData[marcaKey] && tipsData[marcaKey][modeloKey]) {
            tipLocal = tipsData[marcaKey][modeloKey];
            console.log(`🎯 ¡Enganche de señal! Se encontró tip local para: ${marca} ${modelo}`);
        }

        // Directrices fijas del Método OC para moldear la respuesta de la IA
        const directricesMetodo = "Aplica el Método OC. Usa conocimientos avanzados en electrónica de TVs modernos. Analiza voltajes en la fuente, señales LVDS/Mini-LVDS, voltajes de compuerta T-CON (VGH, VGL, VCOM) y fallas comunes en COF/TAB.";

        // 🧠 PROMPT ESTRUCTURADO: Aquí fusionamos su base local con la IA
        const prompt = `Actúa como un expertisimo instructor de reparación de televisores modernos.
        
        DIRECTRICES GENERALES DEL MÉTODO OC:
        ${directricesMetodo}
        
        INFORMACIÓN CRÍTICA DEL COMPAÑERO/BASE DE DATOS LOCAL (tips.js):
        ${tipLocal}
        
        REPORTE DEL TV EN BANCO ACTUAL:
        - MARCA: ${marca}
        - MODELO: ${modelo}
        - SÍNTOMA: ${sintoma}
        - PRUEBAS REALIZADAS: ${descartes || 'Ninguna registrada'}
        
        INSTRUCCIÓN DE SALIDA: Provee un diagnóstico estructurado bajo el Método OC. Si en la sección de 'INFORMACIÓN CRÍTICA LOCAL' se incluyeron enlaces o links multimedia de videos [VIDEO] o manuales [PDF], debes incluirlos obligatoriamente al final de tu respuesta de forma idéntica, tal cual vienen escritos, para que el sistema los renderice en la pantalla como botones.`;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(200).json({ text: "⚠️ FUEGO EN LA FUENTE: El servidor VPS no está detectando la variable GEMINI_API_KEY en Coolify." });
        }

        // Inicializamos el cliente de Inteligencia Artificial
        const genAI = new GoogleGenerativeAI(apiKey);
        const modelAI = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Envío de señal a los servidores de Google
        const result = await modelAI.generateContent(prompt);
        const responseIA = await result.response;
        const textoFinal = responseIA.text();

        // Retornamos la respuesta limpia en JSON
        return res.status(200).json({ text: textoFinal });

    } catch (error) {
        console.error("DETALLE GENERAL DEL COLAPSO EN EL VPS:", error.message);
        return res.status(500).json({ text: `⚙️ ERROR INTERNO DEL SERVIDOR: ${error.message}` });
    }
});

// FILAMENTO DE ENCENDIDO: Mantiene el servidor operando las 24/7
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor PRO operando con éxito y escuchando en puerto ${PORT}`);
});