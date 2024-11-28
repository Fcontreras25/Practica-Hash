import { Pool } from 'pg';

// Configurar conexión a Neon
const db = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { usuario, password } = req.body;

    // Validar datos
    if (typeof usuario !== 'string' || !usuario.trim()) {
      return res.status(400).json({ error: 'El nombre de usuario es requerido.' });
    }
    if (!/^[a-f0-9]{64}$/.test(password)) {
      return res.status(400).json({ error: 'Formato de contraseña inválido.' });
    }

    try {
      // Verificar usuario y contraseña
      const query = 'SELECT * FROM usuarios WHERE id_usuario = $1 AND contraseña = $2';
      const results = await db.query(query, [usuario, password]);

      if (results.rowCount === 0) {
        return res.status(401).json({ error: 'Credenciales incorrectas.' });
      }

      const user = results.rows[0];
      return res.status(200).json({
        mensaje: 'Inicio de sesión exitoso.',
        usuario: user.id_usuario,
      });
    } catch (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Método no permitido.' });
  }
}
