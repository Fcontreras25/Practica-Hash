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

    // Función para verificar contraseñas vulneradas (usando Pwned Passwords API)
    const isPasswordPwned = async (password: string): Promise<boolean> => {
        const hashedPassword = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(password));
        const hexHash = Array.from(new Uint8Array(hashedPassword))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('')
            .toUpperCase();
        const prefix = hexHash.substring(0, 5);
        const suffix = hexHash.substring(5);

        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        const text = await response.text();
        return text.includes(suffix);
    };

    // Función para validar la contraseña según los estándares de Microsoft
    const validarContrasena = async (password: string): Promise<string | null> => {
        if (password.length < 8) {
            return 'La contraseña debe tener al menos 8 caracteres.';
        }
        if (!/[A-Z]/.test(password)) {
            return 'La contraseña debe contener al menos una letra mayúscula.';
        }
        if (!/[a-z]/.test(password)) {
            return 'La contraseña debe contener al menos una letra minúscula.';
        }
        if (!/\d/.test(password)) {
            return 'La contraseña debe contener al menos un número.';
        }
        if (!/[@$!%*?&]/.test(password)) {
            return 'La contraseña debe contener al menos un símbolo especial (@, $, !, %, *, ?, &).';
        }
        if (['password', '123456', 'qwerty'].includes(password.toLowerCase())) {
            return 'La contraseña no debe ser común ni fácil de adivinar.';
        }

        // Comprobar si la contraseña ha sido vulnerada previamente
        if (await isPasswordPwned(password)) {
            return 'La contraseña ha sido comprometida en una filtración de datos. Elige otra.';
        }

        return null;
    };

    // Función para hashear la contraseña usando SHA-256
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

        // Validación de la nueva contraseña
        const errorValidacion = await validarContrasena(nuevaContra);
        if (errorValidacion) {
            setError(errorValidacion);
            return;
        }

        if (nuevaContra !== confirmarContra) {
            setError('Las contraseñas no coinciden. Por favor, verifica e intenta nuevamente.');
            return;
        }

        try {
            // Hashear la contraseña antes de enviarla al servidor
            const hashedPassword = await hashPassword(nuevaContra);

            const response = await fetch('http://localhost:3000/guardarNuevaContra', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idUsuario,
                    nuevaContraseña: hashedPassword, // Contraseña hasheada en SHA-256
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Error al restablecer la contraseña. Intenta más tarde.');
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
                    Ingresa una nueva contraseña para tu cuenta. La contraseña debe cumplir con los siguientes requisitos: 
                    Al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número, un símbolo especial (@, $, !, %, *, ?, &).
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
