import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    try {

        const { image, extraData } = req.body;

        if (!image) {
            return res.status(400).json({ error: "Imagen requerida" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const result = await model.generateContent({
            contents: [{
                parts: [
                    {
                        text: `Analiza esta tarjeta electrónica bajo el MÉTODO OC. ${extraData || ""}`
                    },
                    {
                        inlineData: {
                            mimeType: "image/jpeg",
                            data: image
                        }
                    }
                ]
            }]
        });

        return res.status(200).json({
            text: result.response.text()
        });

    } catch (error) {

        return res.status(500).json({
            error: "Error en análisis de imagen"
        });
    }
}