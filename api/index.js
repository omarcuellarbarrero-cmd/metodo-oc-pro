import express from 'express';

const app = express();

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

app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});
