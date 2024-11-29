import { db } from '@vercel/postgres';
import fs from 'fs/promises';

// Ruta al archivo JSON en la carpeta temporal
const tokenFilePath = '/tmp/tokens.json';

// Función para cargar los tokens desde el archivo JSON
async function loadTokens() {
  try {
    const data = await fs.readFile(tokenFilePath, 'utf8').catch(() => '[]');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error al cargar tokens desde el archivo:', err);
    return [];
  }
}

// Función para guardar los tokens en el archivo JSON
async function saveTokens(tokens) {
  try {
    await fs.writeFile(tokenFilePath, JSON.stringify(tokens, null, 2), 'utf8');
  } catch (err) {
    console.error('Error al guardar tokens en el archivo:', err);
  }
}

// Exportar la función principal
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { token } = req.query;

    try {
      // Cargar los tokens existentes
      const tokens = await loadTokens();

      // Buscar el token
      const index = tokens.findIndex((t) => t.token === token);
      if (index === -1) {
        return res.status(400).send('Token inválido o expirado');
      }

      const { idUsuario, correo, contra, expiracion } = tokens[index];

      // Validar si el token ha expirado
      if (Date.now() > expiracion) {
        tokens.splice(index, 1); // Eliminar token expirado
        await saveTokens(tokens);
        return res.status(400).send('Token expirado');
      }

      // Eliminar el token después de usarlo
      tokens.splice(index, 1);
      await saveTokens(tokens);

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
