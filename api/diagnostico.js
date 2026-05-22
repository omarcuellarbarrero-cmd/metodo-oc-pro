import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // Forzamos cabeceras de libre acceso (CORS) para evitar cualquier bloqueo del navegador
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ text: "Método no permitido" });
    }

    try {
        const { marca, modelo, sintoma, descartes } = req.body;

        // Validamos que los componentes requeridos hayan llegado bien
        if (!marca || !modelo || !sintoma) {
            return res.status(200).json({ text: "⚠️ ERROR EN RECEPCIÓN: Faltan datos técnicos en el reporte enviado desde el buscador." });
        }

        // Base de conocimiento integrada de forma interna para evitar fallas de lectura de disco (Bypass de tips.txt)
        const tipsContenido = "Aplica el Método OC. Usa conocimientos avanzados en electrónica de TVs modernos. Analiza voltajes en la fuente, señales LVDS/Mini-LVDS, voltajes de compuerta T-CON (VGH, VGL, VCOM) y fallas comunes en COF/TAB.";

        // Estructura del Prompt para el motor de la IA
        const prompt = `Actúa como un experto instructor de reparación de televisores modernos. 
        Basándote en estas directrices técnicas: ${tipsContenido}
        Analiza detalladamente la siguiente falla en banco y provee un diagnóstico estructurado:
        MARCA: ${marca} | MODELO: ${modelo} | SÍNTOMA: ${sintoma} | PRUEBAS REALIZADAS: ${descartes || 'Ninguna registrado'}`;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(200).json({ 
                text: "⚠️ FUEGO EN LA FUENTE: Vercel no está detectando la variable GEMINI_API_KEY en el panel de control." 
            });
        }

        // Inicializamos el cliente de Inteligencia Artificial
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Envío de señal a los servidores de Google
        const result = await model.generateContent(prompt);
        const responseIA = await result.response;
        const textoFinal = responseIA.text();

        // Si todo sale bien, retornamos la respuesta limpia en JSON
        return res.status(200).json({ text: textoFinal });

    } catch (error) {
        console.error("DETALLE GENERAL DEL COLAPSO EN VERCEL:", error.message);
        return res.status(500).json({ 
            text: `⚙️ ERROR INTERNO DEL SERVIDOR (COLAPSO MOTOR IA): ${error.message}` 
        });
    }
}