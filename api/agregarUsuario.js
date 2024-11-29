import { db } from '@vercel/postgres';
import fs from 'fs/promises';
import path from 'path';

// Ruta al archivo JSON
const tokenFilePath = path.resolve('./tokens.json');

// Verificar y crear el archivo si no existe o está vacío
async function ensureTokenFileExists() {
  try {
    await fs.access(tokenFilePath); // Verifica si el archivo existe
    const data = await fs.readFile(tokenFilePath, 'utf8');
    if (!data.trim()) {
      // Si el archivo está vacío, lo inicializa con un array vacío
      await fs.writeFile(tokenFilePath, '[]', 'utf8');
    }
  } catch {
    // Si el archivo no existe, lo crea con un array vacío
    await fs.writeFile(tokenFilePath, '[]', 'utf8');
  }
}

// Asegurarse de que el archivo exista al iniciar
await ensureTokenFileExists();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { token } = req.query; // Recuperar el token enviado en la consulta

    try {
      // Leer el archivo JSON
      const data = await fs.readFile(tokenFilePath, 'utf8');
      const tokens = JSON.parse(data || '[]'); // Manejar archivo vacío

      // Buscar el token
      const index = tokens.findIndex((t) => t.token === token);
      if (index === -1) {
        return res.status(400).send('Token inválido o expirado');
      }

      const { idUsuario, correo, contra, expiracion } = tokens[index];

      // Validar si el token ha expirado
      if (Date.now() > expiracion) {
        tokens.splice(index, 1); // Eliminar token expirado
        await fs.writeFile(tokenFilePath, JSON.stringify(tokens, null, 2));
        return res.status(400).send('Token expirado');
      }

      // Eliminar el token después de usarlo
      tokens.splice(index, 1);
      await fs.writeFile(tokenFilePath, JSON.stringify(tokens, null, 2));

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
    } catch (err) {
      console.error('Error al procesar token:', err);
      res.status(500).send('Error interno del servidor.');
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).send('Método no permitido');
  }
}
