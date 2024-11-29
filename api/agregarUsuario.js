import { db } from '@vercel/postgres';
import { pendingUsers } from './crearCuenta.js'; 

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { token } = req.query; // Recuperar el token enviado en la consulta

    // Verificar si el token existe en `pendingUsers`
    if (!pendingUsers.has(token)) {
      return res.status(400).send('Token inválido o expirado');
    }

    // Recuperar datos asociados al token
    const { idUsuario, correo, contra, expiracion } = pendingUsers.get(token);

    // Validar si el token ha expirado
    if (Date.now() > expiracion) {
      pendingUsers.delete(token); // Eliminar token expirado
      return res.status(400).send('Token expirado');
    }

    // Eliminar el token después de usarlo
    pendingUsers.delete(token);

    // Registrar al usuario en la base de datos
    const client = await db.connect();
    try {
      const query = `INSERT INTO usuarios (id_usuario, correo, contrasena, verificado) VALUES ($1, $2, $3, true)`;
      await client.query(query, [idUsuario, correo, contra]);

      res.status(200).send('Cuenta verificada y registrada exitosamente');
    } catch (err) {
      console.error('Error al registrar usuario:', err);
      res.status(500).send('Error interno del servidor.');
    } finally {
      client.release();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).send('Método no permitido');
  }
}
