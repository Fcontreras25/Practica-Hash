import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { db } from '@vercel/postgres'; 

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Función principal exportada
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { idUsuario, correo, contra } = req.body;

    // Validar que la contraseña esté en formato hash SHA-256
    if (!/^[a-f0-9]{64}$/.test(contra)) {
      return res.status(400).send('Formato de hash inválido.');
    }
    
    try {

       // Conectar a la base de datos
       const client = await db.connect();

       // Verificar si el correo ya existe
       const checkQuery = 'SELECT 1 FROM public.usuarios WHERE correo = $1';
       const result = await client.query(checkQuery, [correo]);
 
       if (result.rows.length > 0) {
         // Si el correo ya está registrado
         return res.status(409).send('El correo ya está registrado.');
       }

      // Verificar si el usuario ya existe
      const consultaUsuario = 'SELECT 1 FROM public.usuarios WHERE id_usuario = $1';
      const resultado = await client.query(consultaUsuario, [idUsuario]);

      if (resultado.rows.length > 0) {
        // Si el correo ya está registrado
        return res.status(409).send('El usuario ya existe.');
      } 

      // Generar un token JWT con la información del usuario
      const token = jwt.sign(
        { idUsuario, correo, contra }, // Datos que se incluirán en el token
        process.env.JWT_SECRET,       // Clave secreta para firmar el token
        { expiresIn: '1h' }           // El token expira en 1 hora
      );

      // Log para depuración
      console.log(`Token generado: ${token}`);

      // Construir el enlace de verificación con el token
      const verificationLink = `https://ciphertech.vercel.app/api/agregarUsuario?token=${token}`;

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

      // Enviar el correo
      await transporter.sendMail(mailOptions);

      res.status(200).send('Correo de verificación enviado.');
    } catch (err) {
      console.error('Error al enviar correo:', err);
      res.status(500).send('Error al enviar el correo.');
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).send('Método no permitido');
  }
}
