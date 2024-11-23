import express from 'express';
import crypto from 'crypto';

const router = express.Router();

const setupNuevaContraRoutes = (db) => {
    const validarContraseña = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    router.post('/guardarNuevaContra', (req, res) => {
        console.log('Datos recibidos:', req.body); // Para depurar

        const { idUsuario, nuevaContraseña: nuevaContra, confirmarContraseña: confirmarContra } = req.body;

        // Confirmar que idUsuario es un string
        console.log('ID Usuario recibido como:', typeof idUsuario, idUsuario);

        if (typeof idUsuario !== 'string' || !idUsuario.trim()) {
            return res.status(400).json({ error: 'ID Usuario inválido o no proporcionado.' });
        }

        if (nuevaContra !== confirmarContra) {
            return res.status(400).json({ error: 'Las contraseñas no coinciden. Intenta de nuevo.' });
        }

        if (!validarContraseña(nuevaContra)) {
            return res.status(400).json({
                error:
                    'La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un símbolo.',
            });
        }

        const hashedPassword = crypto.createHash('sha256').update(nuevaContra).digest('hex');
        const query = 'UPDATE usuarios SET contraseña = ? WHERE id_usuario = ?';

        db.query(query, [hashedPassword, idUsuario], (err, result) => {
            if (err) {
                console.error('Error al actualizar la contraseña:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado.' });
            }

            return res.status(200).json({ mensaje: 'Contraseña actualizada correctamente' });
        });
    });

    return router;
};

export default setupNuevaContraRoutes;
