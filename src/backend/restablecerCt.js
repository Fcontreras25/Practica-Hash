import express from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const router = express.Router();

const setupRestablecerCtRoutes = (db) => {
  router.post('/verificarUsuario', (req, res) => {
    const { usuario } = req.body;

    if (!usuario) {
      return res.status(400).json({ error: 'El campo usuario es obligatorio.' });
    }

    const query = 'SELECT * FROM usuarios WHERE id_usuario = $1';
    db.query(query, [usuario])
      .then((results) => {
        if (results.rowCount > 0) {
          const correo = results.rows[0].correo;
          const idUsuario = results.rows[0].id_usuario;

          const enlaceRestablecimiento = `http://localhost:3000/nueva-contra?idUsuario=${idUsuario}`;

          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'practicaHash@gmail.com',
              pass: 'gijq rmyo utej glhe',
            },
          });

          const mailOptions = {
            from: 'practicaHash@gmail.com',
            to: correo,
            subject: 'Restablecimiento de contraseña',
            html: `
              <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background-color: #f4f4f9; padding: 20px; font-family: Arial, sans-serif;">
                <div style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); padding: 20px; text-align: center; border: 1px solid #ddd;">
                  <h1 style="color: #333;">Restablecimiento de contraseña</h1>
                  <p style="color: #555;">Estimado/a ${idUsuario},</p>
                  <p style="color: #555;">Para restablecer tu contraseña, da clic en el siguiente enlace:</p>
                  <a href="${enlaceRestablecimiento}" style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin: 20px 0;">Restablecer contraseña</a>
                  <p style="color: #555;">Si no solicitaste este cambio, ignora este mensaje.</p>
                  <img src="https://drive.google.com/uc?id=1f-7y3I_YdU_AiJ6IpSEdWpn1_E8b_22h" alt="Logotipo" style="width: 150px; height: auto; margin-bottom: 20px;">
                  <p style="color: #555;">Desciframos el presente para proteger tu futuro</p>
                </div>
              </div>
            `,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Error al enviar el correo:', error);
              return res.status(500).json({ error: 'Error al enviar el correo electrónico' });
            }

            console.log('Correo enviado:', info.response);
            return res.status(200).json({ mensaje: 'Hemos enviado un correo con las instrucciones para restablecer tu contraseña.' });
          });
        } else {
          return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
      })
      .catch((err) => {
        console.error('Error al consultar la base de datos:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      });
  });

  return router;
};

export default setupRestablecerCtRoutes;
