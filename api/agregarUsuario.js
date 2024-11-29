import { db } from '@vercel/postgres';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { token } = req.query;

    if (!token) {
      return res.status(400).send('Token no proporcionado.');
    }

    try {
      // Verificar y decodificar el token JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const { idUsuario, correo, contra } = decoded;

      // Conectar a la base de datos y registrar al usuario
      const client = await db.connect();

      try {
        const query = `
        INSERT INTO public.usuarios (id_usuarios, correo, contrasena, verificado)
        VALUES ($1, $2, $3, true)
      `;
      await client.query(query, [idUsuario, correo, contra]);

        res.status(200).send('Cuenta verificada y registrada exitosamente.');
      } catch (err) {
        console.error('Error al registrar usuario:', err);
        res.status(500).send('Error interno del servidor.');
      } finally {
        client.release();
      }
    } catch (err) {
      console.error('Error al verificar token:', err);
      res.status(400).send('Token inválido o expirado.');
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).send('Método no permitido');
  }
}
