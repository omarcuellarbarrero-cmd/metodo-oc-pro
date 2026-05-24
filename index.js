import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(express.json());
app.use(express.static('.'));

app.post('/api/diagnostico', async (req, res) => {
    // Respuesta simulada de prueba
    res.json({ text: "DIAGNÓSTICO SIMULADO: Maestro, el servidor responde correctamente. El Método OC está activo. Si esto funciona, el error 429 viene de la cuota de su API Key de Google." });
});
app.listen(process.env.PORT || 3000, '0.0.0.0');