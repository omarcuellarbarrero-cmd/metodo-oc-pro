import { GoogleGenerativeAI } from "@google/generative-ai";
import express from 'express';
import path from 'path'; // Importaciones arriba
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 1. PRIMERO inicializa express
const app = express(); 

// 2. LUEGO configura los middlewares
app.use(express.json());
app.use(express.static('.'));

// 3. AHORA SÍ puedes usar 'app' para las rutas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 4. Tus otras rutas (diagnóstico, etc)
app.post('/api/diagnostico', async (req, res) => { 
    // ... su lógica ...
});

// 5. FINALMENTE escuchas el puerto
app.listen(process.env.PORT || 3000, '0.0.0.0');