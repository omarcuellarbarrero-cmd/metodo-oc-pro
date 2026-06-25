import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const app = express();

app.use(express.json({ limit: '20mb' }));
app.use(express.static('public'));

function getGemini() {
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error('GEMINI_API_KEY no configurada');
}

return new GoogleGenerativeAI(apiKey);


}

/* ==========================
VALIDAR ACCESO
========================== */

app.post('/api/validar-acceso', async (req, res) => {
try {
const { token } = req.body;


    const filePath = join(process.cwd(), 'claves.txt');

    if (!existsSync(filePath)) {
        return res.status(500).json({
            valido: false,
            error: 'No hay base de datos de claves'
        });
    }

    const contenido = readFileSync(filePath, 'utf8');

    const listaClaves = contenido
        .split('\n')
        .map(c => c.trim().toUpperCase());

    return res.json({
        valido: listaClaves.includes(
            (token || '').trim().toUpperCase()
        )
    });

} catch (error) {
    console.error(error);

    return res.status(500).json({
        valido: false
    });
}

});

/* ==========================
FUNDAMENTOS
========================== */

app.post('/api/fundamentos', async (req, res) => {
try {
const { consulta } = req.body;

    let fundamentosContenido = '';

    try {
        fundamentosContenido = readFileSync(
            join(process.cwd(), 'fundamentos.txt'),
            'utf8'
        );
    } catch (e) {
        fundamentosContenido =
            'Explica conceptos de electrónica de forma pedagógica.';
    }

    const systemPrompt = `

¡¡Qué tal amigo y colega! Eres el Instructor de Fundamentos OC.

BASE DE CONOCIMIENTOS:
${fundamentosContenido}

REGLAS:

1. Saluda siempre con "¡¡Qué tal amigo y colega!".
2. Explica de forma pedagógica.
3. Si existen recursos en la base de conocimiento, inclúyelos al final.
   `;

    const genAI = getGemini();

    const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash'
    });

    const result = await model.generateContent(
        `${systemPrompt}
  
Explícame: ${consulta}`
);

    return res.json({
        text: result.response.text()
    });

} catch (error) {
    console.error(error);

    return res.json({
        text: '¡¡Qué tal amigo y colega! Intenta de nuevo.'
    });
}

});

/* ==========================
DIAGNÓSTICO
========================== */

app.post('/api/diagnostico', async (req, res) => {
try {
const {
marca,
modelo,
sintoma,
descartes
} = req.body;

    const genAI = getGemini();

    const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash'
    });

    const prompt = `


Actúa como experto en reparación de televisores.

Marca: ${marca}
Modelo: ${modelo}
Síntoma: ${sintoma}
Descartes realizados: ${descartes || 'Ninguno'}

Genera un diagnóstico técnico siguiendo el Método OC.
`;


    const result = await model.generateContent(prompt);

    return res.json({
        text: result.response.text()
    });

} catch (error) {
    console.error(error);

    return res.status(500).json({
        text: error.message
    });
}


});

/* ==========================
HEALTHCHECK
========================== */

app.get('/health', (req, res) => {
res.json({
ok: true,
status: 'running'
});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log(`Servidor iniciado en puerto ${PORT}`);
});
