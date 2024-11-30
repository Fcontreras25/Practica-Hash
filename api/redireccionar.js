export default function handler(req, res) {
  const { idUsuario } = req.query;

  if (!idUsuario) {
    return res.status(400).json({ error: 'Falta el parámetro idUsuario' });
  }

  // Redirige a una URL absoluta (dominio completo)
  res.writeHead(301, {
    Location: `https://ciphertech.vercel.app/nueva-contra?idUsuario=${idUsuario}`
  });
  res.end();
}
