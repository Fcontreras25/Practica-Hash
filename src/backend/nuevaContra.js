import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';

const app = express();
app.use(bodyParser.json());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'usuario',
    database: 'login', 
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos');
    }
});

// Función para validar la contraseña
const validarContraseña = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};

// Ruta para almacenar la nueva contraseña
app.post('/guardarNuevaContraseña', (req, res) => {
    const { idUsuario, nuevaContraseña, confirmarContraseña } = req.body;

    // Verificar que las contraseñas coincidan
    if (nuevaContraseña !== confirmarContraseña) {
        return res.status(400).json({ error: 'Las contraseñas no coinciden. Intenta de nuevo.' });
    }

    // Validar el formato de la contraseña
    if (!validarContraseña(nuevaContraseña)) {
        return res.status(400).json({
            error:
                'La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un símbolo.',
        });
    }

    // Encriptar la contraseña antes de almacenarla (opcional, pero recomendado)
    const hashedPassword = crypto.createHash('sha256').update(nuevaContraseña).digest('hex');

    // Actualizar la contraseña en la base de datos
    const query = 'UPDATE usuarios SET contraseña = ? WHERE id_usuario = ?';
    db.query(query, [hashedPassword, idUsuario], (err, result) => {
        if (err) {
            console.error('Error al actualizar la contraseña:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        return res.status(200).json({ mensaje: 'Contraseña actualizada correctamente' });
    });
});

// Servidor en puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
