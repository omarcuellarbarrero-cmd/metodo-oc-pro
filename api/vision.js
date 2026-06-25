async function registrarEnGoogle(tipo, consulta) {
    const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzbda-nJHLn45ELAwHvLAZvSYb1MMm6f4bXWIstdWNqcrqIUdvZmLLk1etpuQL9uywP/exec"; // <--- PEGA TU URL AQUÍ
    try {
        await fetch(WEBHOOK_URL, {
            method: 'POST',
            body: JSON.stringify({ tipo, consulta })
        });
    } catch (e) { console.error("Error en bitácora externa"); }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Método no permitido');

    const { image, extraData } = req.body;
    const API_KEY = "AQ.Ab8RN6KwARs0wC8ku7IiLP87hP1G0Jkk3Vs-JlGQkIvdsVViRQ".trim(); 

    // Registro en la Caja Negra (Vercel + Google Sheets)
    console.log(`[LOG VISION] Texto: "${extraData || 'Sin descripción'}"`);
    await registrarEnGoogle("VISION", extraData || "Escaneo de imagen");

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
        const payload = {
            contents: [{
                parts: [
                    { text: "Analiza esta tarjeta electrónica. Identifica etapas y sugiere mediciones según el MÉTODO OC." },
                    { inlineData: { mimeType: "image/jpeg", data: image } },
                    { text: `Información adicional del técnico: ${extraData}` }
                ]
            }]
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        const resultText = data.candidates[0].content.parts[0].text;
        return res.status(200).json({ text: resultText });

    } catch (error) {
        return res.status(500).json({ error: "Falla en análisis de imagen" });
    }
}
