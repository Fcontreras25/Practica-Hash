import { Pool } from 'pg';

const db = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { idUsuario, correo, contra } = req.body;

    if (!idUsuario || !correo || !contra) {
      return res.status(400).json({ error: 'Faltan datos requeridos.' });
    }

    try {
      const query = 'INSERT INTO usuarios (id_usuario, correo, contraseña) VALUES ($1, $2, $3)';
      await db.query(query, [idUsuario, correo, contra]);
      return res.status(200).json({ mensaje: 'Cuenta creada exitosamente.' });
    } catch (err) {
      console.error('Error al crear la cuenta:', err);
      return res.status(500).json({ error: 'Error al crear la cuenta.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Método no permitido.' });
  }
}
