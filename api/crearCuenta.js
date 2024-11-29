import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Almacén temporal en memoria
const pendingUsers = new Map(); // { token: { idUsuario, correo, contra, expiracion } }

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'practicaHash@gmail.com',
    pass: 'gijq rmyo utej glhe',
  },
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { idUsuario, correo, contra } = req.body;

    // Validar que la contraseña esté hasheada
    if (!/^[a-f0-9]{64}$/.test(contra)) {
      return res.status(400).send('Formato de hash inválido.');
    }

    // Generar token de verificación
    const token = crypto.randomBytes(32).toString('hex');


    // Guardar token en el almacenamiento temporal
    const expiracion = Date.now() + 3600 * 1000; // Expira en 1 hora
    pendingUsers.set(token, { idUsuario, correo, contra, expiracion });

    // Log para depuración: Token generado con éxito
    console.log(`Token generado con éxito: ${token}`);

    // Enlace de verificación
    const verificationLink = `https://https://ciphertech.vercel.app//api/agregarUsuario?token=${token}`;

    // Opciones del correo
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
            <p style="color: #555; font-size: 14px;">Desciframos el presente para proteger tu futuro</p>
            <img src="https://drive.google.com/uc?id=1f-7y3I_YdU_AiJ6IpSEdWpn1_E8b_22h" alt="Logotipo" style="width: 150px; height: auto; margin-top: 30px;">

          </div>
        </div>
      `,
    };

    try {
      // Enviar correo
      await transporter.sendMail(mailOptions);
      res.status(200).send('Correo de verificación enviado. Revisa tu bandeja de entrada.');
    } catch (err) {
      console.error('Error al enviar correo:', err);
      res.status(500).send('Error al enviar el correo de verificación.');
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).send('Método no permitido');
  }
}

// Limpieza automática de tokens expirados
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of pendingUsers) {
    if (data.expiracion < now) {
      pendingUsers.delete(token);
    }
  }
}, 60000); // Ejecuta cada minuto
