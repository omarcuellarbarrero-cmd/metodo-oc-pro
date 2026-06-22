export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ valido: false });
    }

    const { token } = req.body;

    const keys = (process.env.ACCESS_KEYS || "")
        .split(",")
        .map(k => k.trim().toUpperCase());

    const valido = keys.includes((token || "").toUpperCase());

    return res.status(200).json({ valido });
}