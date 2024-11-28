import { Pool } from 'pg';

// Configurar conexión a Neon
const db = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { idUsuario, nuevaContraseña: hashedPassword } = req.body;

    // Validar que `idUsuario` y `hashedPassword` sean válidos
    if (!idUsuario || typeof idUsuario !== 'string' || !hashedPassword || !/^[a-f0-9]{64}$/.test(hashedPassword)) {
      return res.status(400).json({ error: 'Datos inválidos. Verifica los campos enviados.' });
    }

    try {
      // Actualizar la contraseña en la base de datos
      const query = 'UPDATE usuarios SET contraseña = $1 WHERE id_usuario = $2';
      const result = await db.query(query, [hashedPassword, idUsuario]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }

      return res.status(200).json({ mensaje: 'Contraseña actualizada correctamente.' });
    } catch (err) {
      console.error('Error al actualizar la contraseña:', err);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Método no permitido.' });
  }
}
