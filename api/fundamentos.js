const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { consulta, token } = req.body;

    let fundamentosContenido = "";
    try {
      fundamentosContenido = fs.readFileSync(path.join(process.cwd(), 'fundamentos.txt'), 'utf8');
    } catch (e) {
      fundamentosContenido = "Explica conceptos de electrónica de forma pedagógica.";
    }

    const systemPrompt = `
¡¡Qué tal amigo y colega! Eres el Instructor de "Fundamentos OC".

BASE DE CONOCIMIENTOS:
${fundamentosContenido}

REGLAS DE FORMATO:
1. SALUDO: "¡¡Qué tal amigo y colega!".
2. RECURSOS: Si el fundamento tiene links en la base de datos, agrégalos al final exactamente así:
   - VIDEO: [link]
   - IMAGEN: [link]
   - MANUAL: [link]
`;

    const API_KEY = "AIzaSyBJWUZ_1XmJ4wVUYiP4258ouapAYVpFcb0"; 
    const genAI = new GoogleGenerativeAI(API_KEY);
    const modelIA = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      systemInstruction: systemPrompt 
    });

    const result = await modelIA.generateContent(`Explícame: ${consulta}`);
    const responseIA = await result.response.text();

    return res.status(200).json({ text: responseIA });

  } catch (error) {
    return res.status(200).json({ text: "¡¡Qué tal amigo y colega! Intenta de nuevo." });
  }
};