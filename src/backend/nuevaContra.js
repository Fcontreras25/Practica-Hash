import express from 'express';
import crypto from 'crypto';

const router = express.Router();

const setupNuevaContraRoutes = (db) => {
    router.post('/guardarNuevaContra', (req, res) => {
        console.log('Datos recibidos:', req.body);

        const { idUsuario, nuevaContraseña: hashedPassword } = req.body;

        // Validar que idUsuario sea un string no vacío
        if (typeof idUsuario !== 'string' || !idUsuario.trim()) {
            console.error('ID Usuario inválido:', idUsuario);
            return res.status(400).json({ error: 'ID Usuario inválido o no proporcionado.' });
        }

        // Validar que la contraseña ya esté en formato hash
        if (!/^[a-f0-9]{64}$/.test(hashedPassword)) {
            console.error('Formato de hash inválido:', hashedPassword);
            return res.status(400).json({ error: 'Formato de hash inválido.' });
        }

        const query = 'UPDATE usuarios SET contraseña = ? WHERE id_usuario = ?';

        db.query(query, [hashedPassword, idUsuario], (err, result) => {
            if (err) {
                console.error('Error al actualizar la contraseña:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            if (result.affectedRows === 0) {
                console.error('Usuario no encontrado:', idUsuario);
                return res.status(404).json({ error: 'Usuario no encontrado.' });
            }

            return res.status(200).json({ mensaje: 'Contraseña actualizada correctamente' });
        });
    });

    return router;
};

export default setupNuevaContraRoutes;
