import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Método no permitido');

    const { token } = req.body;

    try {
        const filePath = join(process.cwd(), 'claves.txt');
        
        if (!existsSync(filePath)) {
            return res.status(500).json({ valido: false, error: "No hay base de datos de claves" });
        }

        const contenido = readFileSync(filePath, 'utf8');
        const listaClaves = contenido.split('\n').map(c => c.trim().toUpperCase());

        if (listaClaves.includes(token)) {
            return res.status(200).json({ valido: true });
        } else {
            return res.status(200).json({ valido: false });
        }

    } catch (error) {
        return res.status(500).json({ valido: false });
    }
}