import { db } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { usuario, password } = req.body;

    // Validar datos
    if (!usuario || typeof usuario !== 'string' || !password || !/^[a-f0-9]{64}$/.test(password)) {
      return res.status(400).json({ error: 'Datos inválidos.' });
    }

    const client = await db.connect();
    try {
      const query = 'SELECT * FROM usuarios WHERE id_usuario = $1 AND contraseña = $2';
      const results = await client.query(query, [usuario, password]);

      if (results.rowCount === 0) {
        return res.status(401).json({ error: 'Credenciales incorrectas.' });
      }

      res.status(200).json({
        mensaje: 'Inicio de sesión exitoso.',
        usuario: results.rows[0].id_usuario,
      });
    } catch (err) {
      console.error('Error al consultar la base de datos:', err);
      res.status(500).json({ error: 'Error interno del servidor.' });
    } finally {
      client.release();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Método no permitido.' });
  }
}
