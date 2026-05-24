import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(express.json());
app.use(express.static('.'));

app.post('/api/diagnostico', async (req, res) => {
    try {
        const { marca, modelo, sintoma, descartes } = req.body;
        console.log("Recibido diagnóstico para:", modelo); // Esto aparecerá en los logs de Coolify

        const prompt = `...`; // (Su prompt aquí)

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const modelAI = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        console.log("Consultando a Gemini...");
        const result = await modelAI.generateContent(prompt);
        console.log("Respuesta recibida de Gemini");
        
        res.json({ text: result.response.text() });
// En el bloque 'catch' de su index.js, agregue esto:
} catch (error) {
    if (error.status === 429) {
        res.status(429).json({ text: "Maestro, el sistema está saturado. Por favor, espere 15 segundos y vuelva a intentar." });
    } else {
        console.error("ERROR CRÍTICO:", error);
        res.status(500).json({ text: "Error en servidor: " + error.message });
    }
}
});

app.listen(process.env.PORT || 3000, '0.0.0.0');