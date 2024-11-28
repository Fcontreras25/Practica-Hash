import { Pool } from 'pg';

// Conexión a la base de datos Neon
const db = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

// Almacén temporal para usuarios no verificados
const pendingUsers = new Map(); // { token: { idUsuario, correo, contra } }

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { token } = req.query;

    if (!pendingUsers.has(token)) {
      return res.status(400).send('Token inválido o expirado');
    }

    const { idUsuario, correo, contra } = pendingUsers.get(token);
    pendingUsers.delete(token);

    const query = `
      INSERT INTO usuarios (id_usuario, correo, contraseña, verificado)
      VALUES ($1, $2, $3, true)
    `;

    try {
      await db.query(query, [idUsuario, correo, contra]);
      res.status(200).send('Cuenta verificada y registrada exitosamente');
    } catch (err) {
      console.error('Error al insertar usuario en la base de datos:', err);
      res.status(500).send('Error al registrar usuario');
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).send('Método no permitido');
  }
}
