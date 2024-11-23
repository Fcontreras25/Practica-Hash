import './nuevaContra.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

const Nuevacontra: React.FC = () => {
    const [nuevaContra, setNewPassword] = useState('');
    const [confirmarContra, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [idUsuario, setIdUsuario] = useState<string | null>(null);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const id = queryParams.get('idUsuario');

        if (id) {
            setIdUsuario(id);
        } else {
            setError('No se proporcionó un usuario válido.');
        }
    }, [location]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!idUsuario) {
            setError('No se puede restablecer la contraseña sin un usuario válido.');
            return;
        }

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
                    idUsuario,
                    nuevaContraseña: nuevaContra,
                    confirmarContraseña: confirmarContra,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Error al restablecer la contraseña. Intenta más tarde.');
            } else {
                setSuccess(data.mensaje || '¡Contraseña actualizada con éxito!');
                setTimeout(() => {
                    navigate('/'); 
                }, 2000);
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

                {error && <div className="error-mensaje">{error}</div>}
                {success && <div className="exito-mensaje">{success}</div>}

                <form onSubmit={handleSubmit}>
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
                    <div className="botones">
                        <button type="button" className="btn btn-cancelar" onClick={() => navigate("/")}>
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
