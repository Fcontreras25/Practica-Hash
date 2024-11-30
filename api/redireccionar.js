import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { token } = req.query;

    if (!token) {
      return res.status(400).send('Token no proporcionado.');
    }

    try {
      // Verificar y decodificar el token JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const { idUsuario } = decoded;

      // Redirige a una URL absoluta (dominio completo)
      res.writeHead(301, {
        Location: `https://ciphertech.vercel.app/nueva-contra?idUsuario=${idUsuario}`,
      });
      res.end(); // Termina la respuesta correctamente
    } catch (err) {
      res.status(401).send('Token inválido o expirado.');
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).send('Método no permitido.');
  }
}
