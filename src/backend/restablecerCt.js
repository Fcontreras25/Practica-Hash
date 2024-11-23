import express from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const router = express.Router();

const setupRestablecerCtRoutes = (db) => {
    router.post('/verificarUsuario', (req, res) => {
      const { usuario } = req.body;
  
      console.log(`Usuario recibido: ${usuario}`);
      if (!usuario) {
        return res.status(400).json({ error: 'El campo usuario es obligatorio.' });
      }
  
      const query = 'SELECT * FROM usuarios WHERE id_usuario = ?';
      db.query(query, [usuario], (err, results) => {
        if (err) {
          console.error('Error al consultar la base de datos:', err);
          return res.status(500).json({ error: 'Error interno del servidor' });
        }
  
        if (results.length > 0) {
          const correo = results[0].correo;
          const idUsuario = results[0].id_usuario;
  
          // Imprimir en consola el usuario y el correo
          console.log(`Usuario encontrado: ${idUsuario}`);
          console.log(`Correo electrónico: ${correo}`);
          
          // Generar un código especial o token único para el enlace
          const codigoEspecial = crypto.randomBytes(4).toString('hex');
          const enlaceRestablecimiento = `https://tu-sitio.com/restablecer?token=${codigoEspecial}`;
  
          // Configuración del transporte de correo
          const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
              user: 'practicaHash@gmail.com',
              pass: 'gijq rmyo utej glhe',      
            },
          });
  
          // Contenido del correo
          const mailOptions = {
            from: 'practicaHash@gmail.com', 
            to: correo,
            subject: 'Restablecimiento de contraseña',
            html: `
              <h1>Restablecimiento de contraseña</h1>
              <p>Estimado/a ${idUsuario},</p>
              <p>Para restablecer tu contraseña, da clic en el siguiente enlace:</p>
              <a href="${enlaceRestablecimiento}">Restablecer contraseña</a>
              <p>Si no solicitaste este cambio, ignora este mensaje.</p>
            `,
          };
  
          // Enviar el correo
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
      });
    });
  
    return router;
  };
  
export default setupRestablecerCtRoutes;
