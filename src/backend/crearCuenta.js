import express from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const router = express.Router();

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'practicaHash@gmail.com',
    pass: 'gijq rmyo utej glhe',
  },
});

// Almacén temporal para usuarios no verificados
const pendingUsers = new Map(); // { token: { idUsuario, correo, contra } }

const setupRoutes = (db) => {
  // Ruta para manejar la creación de cuentas
  router.post('/api/form', (req, res) => {
    const { idUsuario, correo, contra } = req.body;

    // Validar que la contraseña ya esté hasheada
    if (!/^[a-f0-9]{64}$/.test(contra)) { // SHA-256 produce un hash de 64 caracteres en hexadecimal
      return res.status(400).send('Formato de hash inválido.');
    }

    const token = crypto.randomBytes(32).toString('hex');

    pendingUsers.set(token, { idUsuario, correo, contra });

    const verificationLink = `http://localhost:3000/api/verify?token=${token}`;
    const mailOptions = {
      from: 'practicaHash@gmail.com',
      to: correo,
      subject: 'Verificación de cuenta',
      html: `
        <p>Hola ${idUsuario},</p>
        <p>Para completar tu registro, haz clic en el siguiente enlace:</p>
        <a href="${verificationLink}">Verificar cuenta</a>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error al enviar el correo:', err);
        return res.status(500).send('Error al enviar el correo de verificación');
      }
      console.log('Correo enviado:', info.response);
      res.status(200).send('Correo de verificación enviado. Revisa tu bandeja de entrada.');
    });
  });

  // Ruta para verificar el correo y guardar en la base de datos
  router.get('/api/verify', (req, res) => {
    const { token } = req.query;

    if (!pendingUsers.has(token)) {
      return res.status(400).send('Token inválido o expirado');
    }

    const { idUsuario, correo, contra } = pendingUsers.get(token);
    pendingUsers.delete(token);

    const query = `
      INSERT INTO usuarios (id_usuario, correo, contraseña, verificado)
      VALUES (?, ?, ?, true)
    `;
    db.query(query, [idUsuario, correo, contra], (err) => {
      if (err) {
        console.error('Error al insertar usuario en la base de datos:', err);
        return res.status(500).send('Error al registrar usuario');
      }
      res.status(200).send('Cuenta verificada y registrada exitosamente');
    });
  });

  return router;
};

export default setupRoutes;
