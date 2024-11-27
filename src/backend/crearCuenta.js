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
         <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background-color: #f4f4f9; padding: 20px; font-family: Arial, sans-serif;">
    <div style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); padding: 20px; text-align: center; border: 1px solid #ddd;">
      <p style="color: #333; font-size: 18px;">Hola ${idUsuario},</p>
      <p style="color: #555; font-size: 16px;">Para completar tu registro, haz clic en el siguiente enlace:</p>
      <a href="${verificationLink}" style="display: inline-block; background-color: #28a745; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin: 20px 0; font-size: 16px;">Verificar cuenta</a>
      <img src="https://drive.google.com/uc?id=1f-7y3I_YdU_AiJ6IpSEdWpn1_E8b_22h" alt="Logotipo" style="width: 150px; height: auto; margin-top: 30px;">
      <p style="color: #555; font-size: 14px;">Desciframos el presente para proteger tu futuro</p>
    </div>
  </div>
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
    VALUES ($1, $2, $3, true)
  `;
    db.query(query, [idUsuario, correo, contra])
      .then(() => res.status(200).send('Cuenta verificada y registrada exitosamente'))
      .catch((err) => {
        console.error('Error al insertar usuario en la base de datos:', err);
        res.status(500).send('Error al registrar usuario');
      });

  });

  return router;
};

export default setupRoutes; 
