import { Pool } from 'pg';
import nodemailer from 'nodemailer';

// Configurar la conexión a Neon
const db = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

// Configurar el transporte de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'practicaHash@gmail.com',
    pass: 'gijq rmyo utej glhe',
  },
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { usuario } = req.body;

    if (!usuario) {
      return res.status(400).json({ error: 'El campo usuario es obligatorio.' });
    }

    try {
      // Consultar usuario en la base de datos
      const query = 'SELECT * FROM usuarios WHERE id_usuario = $1';
      const result = await db.query(query, [usuario]);

      if (result.rowCount > 0) {
        const correo = result.rows[0].correo;
        const idUsuario = result.rows[0].id_usuario;

        const enlaceRestablecimiento = `https://practica-hash-ovkm.vercel.app/nueva-contra?idUsuario=${idUsuario}`;

        // Opciones del correo
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: correo,
          subject: 'Restablecimiento de contraseña',
          html: `
            <div style="font-family: Arial, sans-serif; text-align: center;">
              <h1>Restablecimiento de contraseña</h1>
              <p>Estimado/a ${idUsuario},</p>
              <p>Para restablecer tu contraseña, haz clic en el enlace a continuación:</p>
              <a href="${enlaceRestablecimiento}" style="padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none;">Restablecer contraseña</a>
              <p>Si no solicitaste este cambio, ignora este mensaje.</p>
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
