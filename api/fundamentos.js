import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    try {

        const { consulta } = req.body;

        let base = "Explicación técnica OC";

        try {
            base = fs.readFileSync("./fundamentos.txt", "utf8");
        } catch {}

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const prompt = `
BASE:
${base}

CONSULTA:
${consulta}
        `;

        const result = await model.generateContent(prompt);

        return res.status(200).json({
            text: result.response.text()
        });

    } catch (error) {

        return res.status(500).json({
            error: "Error en fundamentos"
        });
    }
}