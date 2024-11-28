import './index.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Crearcuenta: React.FC = () => {
    const [idUsuario, setIdUsuario] = useState('');
    const [correo, setCorreo] = useState('');
    const [contra, setContra] = useState('');
    const [confirmContra, setConfirmContra] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Estado para mostrar el mensaje de carga

    const navigate = useNavigate();

    // Validación de contraseñas vulneradas (Pwned Passwords)
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

    // Validar contraseñas predecibles
    const isPredictablePassword = (password: string) => {
        const predictablePatterns = ['123456', 'qwerty', 'password', 'abc123', '123123', '111111'];
        return predictablePatterns.includes(password.toLowerCase());
    };

    // Evaluar fortaleza de la contraseña
    const evaluatePasswordStrength = (password: string) => {
        const lengthScore = password.length >= 8 ? 1 : 0;
        const hasUppercase = /[A-Z]/.test(password) ? 1 : 0;
        const hasLowercase = /[a-z]/.test(password) ? 1 : 0;
        const hasNumber = /\d/.test(password) ? 1 : 0;
        const hasSymbol = /[@$!%*?&]/.test(password) ? 1 : 0;

        const score = lengthScore + hasUppercase + hasLowercase + hasNumber + hasSymbol;

        if (score <= 2) return 'Débil';
        if (score === 3) return 'Media';
        return 'Fuerte';
    };

    const handlePasswordChange = (password: string) => {
        setContra(password);
        setPasswordStrength(evaluatePasswordStrength(password));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones generales
        if (contra !== confirmContra) {
            setError('Las contraseñas no coinciden.');
            setSuccessMessage('');
            return;
        }

        if (contra.length < 8 || contra.length > 64) {
            setError('La contraseña debe tener entre 8 y 64 caracteres.');
            setSuccessMessage('');
            return;
        }

        if (isPredictablePassword(contra)) {
            setError('La contraseña no puede ser una secuencia predecible, como "123456" o "qwerty".');
            setSuccessMessage('');
            return;
        }

        if (await isPasswordPwned(contra)) {
            setError('La contraseña ha sido vulnerada anteriormente. Por favor, elige otra.');
            setSuccessMessage('');
            return;
        }

        setError('');
        setIsLoading(true); // Activa el mensaje de carga
        setSuccessMessage('');

        try {
            const hashedPassword = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(contra));
            const hashedHexPassword = Array.from(new Uint8Array(hashedPassword))
                .map((b) => b.toString(16).padStart(2, '0'))
                .join('');

            const response = await fetch('https://practica-hash-ovkm.vercel.app/api/form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idUsuario,
                    correo,
                    contra: hashedHexPassword,
                }),
            });

            setTimeout(async () => {
                setIsLoading(false); // Oculta el mensaje de carga después de unos segundos

                if (response.ok) {
                    setSuccessMessage(
                        'Correo de verificación enviado. Revisa tu correo para verificar tu cuenta antes de iniciar sesión.'
                    );
                    setError('');
                    setIdUsuario('');
                    setCorreo('');
                    setContra('');
                    setConfirmContra('');

                    setTimeout(() => {
                        navigate('/');
                    }, 3000);
                } else {
                    const errorMsg = await response.text();
                    setError(`Error del servidor: ${errorMsg}`);
                    setSuccessMessage('');
                }
            }, 2000); // Espera 2 segundos antes de mostrar el mensaje
        } catch (error) {
            setTimeout(() => {
                setIsLoading(false); // Oculta el mensaje de carga
                setError('Hubo un error de conexión. Intenta nuevamente.');
                setSuccessMessage('');
            }, 2000);
        }
    };

    return (
        <div className="contenedor-principal">
            <div className="alinear">
                <h1>Crear Cuenta</h1>
                <h5>🔒 Protege tu información. Aprende. Crece.</h5>
                <h6>Regístrate ahora y da el primer paso hacia un futuro más seguro.</h6>
            </div>
            <form className="contenedor-form" onSubmit={handleSubmit}>
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Usuario"
                        value={idUsuario}
                        onChange={(e) => setIdUsuario(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="nombre@ruta.com"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                </div>
                <div className="col-auto mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Contraseña"
                        value={contra}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        required
                    />
                </div>
                <div className="password-strength">
                    <p>Fortaleza: {passwordStrength}</p>
                </div>
                <div className="col-auto mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Confirmar contraseña"
                        value={confirmContra}
                        onChange={(e) => setConfirmContra(e.target.value)}
                        required
                    />
                </div>
                {isLoading && <p className="loading-message" style={{ color: '#223ba0' }}>Procesando, por favor espera...</p>}
                {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
                {successMessage && <p className="success-message" style={{ color: 'green' }}>{successMessage}</p>}
                <div className="col-auto d-flex justify-content-between">
                    <button type="submit" className="btn btn-primary mb-3 btn1">
                        Crear
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary mb-3 btn1"
                        onClick={() => navigate('/')}
                    >
                        Volver al Login
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Crearcuenta;
