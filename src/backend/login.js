import express from 'express';

const router = express.Router();

const setupLoginRoutes = (db) => {
  router.post('/api/validarInicio', (req, res) => {
    const { usuario, password } = req.body;

    if (typeof usuario !== 'string' || !usuario.trim()) {
      return res.status(400).json({ error: 'El nombre de usuario es requerido.' });
    }
    if (!/^[a-f0-9]{64}$/.test(password)) {
      return res.status(400).json({ error: 'Formato de contraseña inválido.' });
    }

    const query = 'SELECT * FROM usuarios WHERE id_usuario = $1 AND contraseña = $2';
    db.query(query, [usuario, password])
      .then((results) => {
        if (results.rowCount === 0) {
          return res.status(401).json({ error: 'Credenciales incorrectas.' });
        }
        const user = results.rows[0];
        return res.status(200).json({
          mensaje: 'Inicio de sesión exitoso.',
          usuario: user.id_usuario,
        });
      })
      .catch((err) => {
        console.error('Error al consultar la base de datos:', err);
        res.status(500).json({ error: 'Error interno del servidor.' });
      });
  });

  return router;
};

export default setupLoginRoutes;
