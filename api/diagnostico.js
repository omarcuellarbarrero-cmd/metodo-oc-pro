import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            text: "Método no permitido"
        });
    }

    try {

        const {
            marca,
            modelo,
            sintoma,
            descartes
        } = req.body;

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                text: "GEMINI_API_KEY no configurada"
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const prompt = `
Actúa como experto en reparación de televisores.

Marca: ${marca}
Modelo: ${modelo}
Síntoma: ${sintoma}
Descartes: ${descartes || "Ninguno"}
`;

        const result =
            await model.generateContent(prompt);

        return res.status(200).json({
            text: result.response.text()
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            text: error.message
        });
    }
}