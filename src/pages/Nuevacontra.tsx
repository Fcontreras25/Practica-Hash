import './nuevaContra.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


const Nuevacontra: React.FC = () => {
    const [nuevaContra, setNewPassword] = useState('');
    const [confirmarContra, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [idUsuario, setIdUsuario] = useState<string | null>(null);

    const navigate = useNavigate();
    const location = useLocation();
    
    console.log("ID del usuario recibido:", idUsuario);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const id = queryParams.get('idUsuario');
        if (id) {
            setIdUsuario(id);
        } else {
            setError('No se proporcionó un usuario válido.');
        }
    }, [location]);

    const validarContrasena = async (password: string): Promise<string | null> => {
        if (password.length < 8) {
            return 'La contraseña debe tener al menos 8 caracteres.';
        }
        if (!/[A-Z]/.test(password)) {
            return 'Debe contener al menos una letra mayúscula.';
        }
        if (!/[a-z]/.test(password)) {
            return 'Debe contener al menos una letra minúscula.';
        }
        if (!/\d/.test(password)) {
            return 'Debe contener al menos un número.';
        }
        if (!/[@$!%*?&]/.test(password)) {
            return 'Debe contener al menos un símbolo especial (@, $, !, %, *, ?, &).';
        }
        return null;
    };

    const hashPassword = async (password: string): Promise<string> => {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!idUsuario) {
            setError('No se puede restablecer la contraseña sin un usuario válido.');
            return;
        }

        const errorValidacion = await validarContrasena(nuevaContra);
        if (errorValidacion) {
            setError(errorValidacion);
            return;
        }

        if (nuevaContra !== confirmarContra) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        try {
            const hashedPassword = await hashPassword(nuevaContra);

            const response = await fetch('/api/guardarNuevaContra', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idUsuario, nuevaContraseña: hashedPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Error al restablecer la contraseña.');
            } else {
                setSuccess(data.mensaje || '¡Contraseña actualizada con éxito!');
                setTimeout(() => {
                    navigate('/'); // Redirigir al login
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
                    Ingresa una nueva contraseña para tu cuenta. Debe cumplir con los siguientes requisitos:
                    Al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo especial.
                </p>

                {error && <div className="error-mensaje">{error}</div>}
                {success && <div className="exito-mensaje">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="campo">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Nueva Contraseña"
                            value={nuevaContra}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="campo">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Confirmar Contraseña"
                            value={confirmarContra}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="botones">
                        <button type="button" className="btn btn-cancelar" onClick={() => navigate('/')}>
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
