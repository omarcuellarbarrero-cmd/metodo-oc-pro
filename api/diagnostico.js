import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    try {

        const { marca, modelo, sintoma, descartes } = req.body;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const prompt = `
MÉTODO OC - DIAGNÓSTICO TÉCNICO

Marca: ${marca}
Modelo: ${modelo}
Síntoma: ${sintoma}
Descartes: ${descartes || "Ninguno"}

Genera análisis técnico profesional paso a paso.
        `;

        const result = await model.generateContent(prompt);

        return res.status(200).json({
            text: result.response.text()
        });

    } catch (error) {

        return res.status(500).json({
            error: "Error en diagnóstico"
        });
    }
}