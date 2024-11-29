import { db } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { idUsuario, nuevaContraseña: hashedPassword } = req.body;

    // Validar que los datos sean válidos
    if (!idUsuario || typeof idUsuario !== 'string' || !hashedPassword || !/^[a-f0-9]{64}$/.test(hashedPassword)) {
      return res.status(400).json({ error: 'Datos inválidos. Verifica los campos enviados.' });
    }

    const client = await db.connect();
    try {
      const query = 'UPDATE usuarios SET contraseña = $1 WHERE id_usuario = $2';
      const result = await client.query(query, [hashedPassword, idUsuario]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }

      res.status(200).json({ mensaje: 'Contraseña actualizada correctamente.' });
    } catch (err) {
      console.error('Error al actualizar la contraseña:', err);
      res.status(500).json({ error: 'Error interno del servidor.' });
    } finally {
      client.release();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Método no permitido.' });
  }
}
