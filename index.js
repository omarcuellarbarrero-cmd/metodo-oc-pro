import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(express.json());
app.use(express.static('.'));

app.post('/api/diagnostico', async (req, res) => {
    try {
        const { marca, modelo } = req.body;
        // Respuesta simple para probar conectividad
        res.json({ text: "Sistema Método OC operativo. Consultando modelo: " + modelo });
    } catch (e) {
        res.status(500).json({ text: "Error" });
    }
});

app.listen(process.env.PORT || 3000, '0.0.0.0');