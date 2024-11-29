import nodemailer from 'nodemailer';
import { db } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { usuario } = req.body;

    if (!usuario) {
      return res.status(400).json({ error: 'El campo usuario es obligatorio.' });
    }

    try {
      // Connect to the database
      const client = await db.connect();

      // Consultar usuario en la base de datos
      const query = 'SELECT * FROM usuarios WHERE id_usuario = $1';
      const result = await client.query(query, [usuario]);

      if (result.rowCount > 0) {
        const correo = result.rows[0].correo;
        const idUsuario = result.rows[0].id_usuario;

        const enlaceRestablecimiento = `https://practica-hash-ovkm.vercel.app/nueva-contra?idUsuario=${idUsuario}`;

        // Configurar el transporte de correo
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'practicaHash@gmail.com',
            pass: 'gijq rmyo utej glhe',
          },
        });

        // Opciones del correo
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: correo,
          subject: 'Restablecimiento de contraseña',
          html: `
        <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background-color: #f4f4f9; padding: 20px; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); padding: 20px; text-align: center; border: 1px solid #ddd;">
            <h1>Restablecimiento de contraseña</h1>
              <p>Estimado/a ${idUsuario},</p>
              <p>Para restablecer tu contraseña, haz clic en el enlace a continuación:</p>
              <a href="${enlaceRestablecimiento}" style="padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none;">Restablecer contraseña</a>
              <p>Si no solicitaste este cambio, ignora este mensaje.</p>
            <p style="color: #555; font-size: 14px;">Desciframos el presente para proteger tu futuro</p>
            <img src="https://drive.google.com/uc?id=1f-7y3I_YdU_AiJ6IpSEdWpn1_E8b_22h" alt="Logotipo" style="width: 150px; height: auto; margin-top: 30px;">
          </div>
        </div>
      `,
        };

        // Enviar correo
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ mensaje: 'Correo enviado. Revisa tu bandeja de entrada.' });
      } else {
        return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
      }
    } catch (err) {
      console.error('Error en el servidor:', err);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Método no permitido.' });
  }
}
