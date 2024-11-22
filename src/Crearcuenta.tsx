import './index.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FormData {
    idUsuario: string;
    correo: string;
    contra: string;
}

const Crearcuenta: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({ idUsuario: '', correo: '', contra: '' });
    const [confirmContra, setConfirmContra] = useState<string>(''); // Estado para confirmar contraseña
    const [error, setError] = useState<string>(''); // Estado para manejar errores
    const [successMessage, setSuccessMessage] = useState<string>(''); // Estado para manejar mensajes de éxito
    const navigate = useNavigate(); // Para redirigir al usuario

    // Función para hashear la contraseña usando SHA-256
    const hashPassword = async (password: string): Promise<string> => {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setConfirmContra(value);
    };

    const validatePassword = (password: string) => {
        // Expresión regular para la validación
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validar que la contraseña cumpla con los requisitos
        if (!validatePassword(formData.contra)) {
            setError(
                'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.'
            );
            setSuccessMessage('');
            return;
        }

        // Validar si las contraseñas coinciden
        if (formData.contra !== confirmContra) {
            setError('Las contraseñas no coinciden.');
            setSuccessMessage('');
            return;
        }

        // Si todo está correcto, eliminar el mensaje de error
        setError('');

        try {
            // Hashear la contraseña antes de enviarla al servidor
            const hashedContra = await hashPassword(formData.contra);

            // Enviar los datos con la contraseña hasheada al servidor
            const response = await fetch('http://localhost:3000/api/form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    contra: hashedContra, // Contraseña hasheada
                }),
            });

            if (response.ok) {
                // Mensaje de éxito cuando se envía el correo de verificación
                setSuccessMessage(
                    'Correo de verificación enviado. Revisa tu correo para verificar tu cuenta antes de iniciar sesión.'
                );
                setError('');
                setFormData({ idUsuario: '', correo: '', contra: '' });
                setConfirmContra('');

                // Redirigir al login después de 3 segundos
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            } else {
                const errorMsg = await response.text();
                setError(`Error del servidor: ${errorMsg}`);
                setSuccessMessage('');
            }
        } catch (error) {
            setError('Hubo un error de conexión. Intenta nuevamente.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="contenedor-principal">
            <div className='alinear'>
                <h1>Crear Cuenta</h1>
                <h5>🔒 Protege tu información. Aprende. Crece.</h5>
                <h6>Regístrate ahora y da el primer paso hacia un futuro más seguro.</h6>
            </div>
            <form className="contenedor-form" onSubmit={handleSubmit}>
                {/* Campo de Usuario */}
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Usuario"
                        name="idUsuario"
                        value={formData.idUsuario}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Campo de Correo */}
                <div className="mb-3">
                    <input
                        type="email"
                        className="form-control"
                        name="correo"
                        placeholder="nombre@ruta.com"
                        value={formData.correo}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Campo de Contraseña */}
                <div className="col-auto mb-3">
                    <input
                        type="password"
                        className="form-control"
                        name="contra"
                        placeholder="Contraseña"
                        value={formData.contra}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Campo de Confirmar Contraseña */}
                <div className="col-auto mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Confirmar contraseña"
                        name="contraValidar"
                        value={confirmContra}
                        onChange={handleConfirmChange}
                        required
                    />
                </div>

                {/* Mostrar error si las contraseñas no cumplen los requisitos */}
                {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

                {/* Mostrar mensaje de éxito */}
                {successMessage && <p className="success-message" style={{ color: 'green' }}>{successMessage}</p>}

                {/* Botón de Envío */}
                <div className="col-auto">
                    <button type="submit" className="btn btn-primary mb-3 btn1">
                        Crear
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Crearcuenta;
