export default function handler(req, res) {
    const { idUsuario } = req.query; // Captura el parámetro `idUsuario` desde la URL
  
    if (!idUsuario) {
      // Si falta el parámetro, devuelve un error
      res.status(400).json({ error: 'Falta el parámetro idUsuario.' });
      return;
    }
  
    // Redirige a la ruta /nueva-contra con el parámetro idUsuario
    res.redirect(302, `/nueva-contra?idUsuario=${idUsuario}`);
  }
  