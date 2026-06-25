import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        res.json({
            text: `Backend conectado con éxito. Recibí tu mensaje: "${message}"`
        });

    } catch (error) {
        console.error("Error en el servidor:", error);

        res.status(500).json({
            error: "Hubo un error al procesar tu solicitud."
        });
    }
});

const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});
app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});
