import './nuevaContra.css';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Nuevacontra: React.FC = () => {
    const [nuevaContra, setNewPassword] = useState('');
    const [confirmarContra, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();
    const navegarLogin = () => {
        navigate("/");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación básica antes de enviar al backend
        if (nuevaContra !== confirmarContra) {
            setError('Las contraseñas no coinciden. Por favor, verifica e intenta nuevamente.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/guardarNuevaContra', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idUsuario: 1, // Cambia este valor según sea necesario (puede venir del token en la URL)
                    nuevaContra: nuevaContra,
                    confirmarContra: confirmarContra,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Error al restablecer la contraseña. Intenta más tarde.');
            } else {
                setSuccess(data.mensaje || '¡Contraseña actualizada con éxito!');
                setError(''); // Limpia errores previos
            }
        } catch (err) {
            console.error(err);
            setError('Error al conectar con el servidor. Intenta más tarde.');
        }
    };

    return (
        <div className="contenedor-principal">
            <div className="contenedor-nuevacontra">
                <h2>Restablecimiento de Contraseña</h2>
                <p>
                    Ingresa una nueva contraseña para tu cuenta. La contraseña debe contener al menos 8 caracteres,
                    una letra mayúscula, una minúscula, un número y un símbolo.
                </p>

                {/* Muestra el mensaje de error */}
                {error && <div className="error-mensaje">{error}</div>}
                {/* Muestra el mensaje de éxito */}
                {success && <div className="exito-mensaje">{success}</div>}

                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                    {/* Campo de Nueva Contraseña */}
                    <div className="campo">
                        <input
                            type="password"
                            className="form-control"
                            id="newPassword"
                            placeholder="Nueva Contraseña*"
                            value={nuevaContra}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    {/* Campo de Confirmar Contraseña */}
                    <div className="campo">
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            placeholder="Confirmar Contraseña*"
                            value={confirmarContra}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    {/* Botones */}
                    <div className="botones">
                        <button type="button" className="btn btn-cancelar" onClick={navegarLogin}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-aceptar">
                            Aceptar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Nuevacontra;
