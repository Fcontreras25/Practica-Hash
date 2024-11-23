import './index.css';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const navegarCuenta = () => {
        navigate("/crear-cuenta");
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

        try {
            const hashedPassword = await hashPassword(password);

            const response = await fetch('http://localhost:3000/validarInicio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuario,
                    password: hashedPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('usuario', data.usuario); // Guarda el usuario en el almacenamiento local
                navigate('/bienvenida'); // Redirige a /bienvenida
            } else {
                setError(data.error || 'Credenciales incorrectas. Intenta nuevamente.');
            }
        } catch (err) {
            console.error(err);
            setError('Hubo un error al intentar iniciar sesión. Intenta nuevamente.');
        }
    };

    return (
        <div className="contenedor-principal">
            <div className='contenedor-marca'>
                <h1>CipherTech</h1>
                <h5>Desciframos el presente para proteger tu futuro</h5>
            </div>
            <div className='contenedor-login-principal'>
            <form className="contenedor-login" onSubmit={handleSubmit}>
                <div className='contenedor-input'>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Usuario"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                        />
                    </div>

                    <div className="col-auto mb-3">
                        <input
                            type="password"
                            className="form-control"
                            id="inputPassword2"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p className="error-mensaje" style={{ color: 'red' }}>{error}</p>}

                    <div className="col-auto">
                        <button type="submit" className="btn btn-primary mb-3 btn1">
                            Iniciar sesión
                        </button>
                    </div>

                    <div className="text-center mb-3">
                        <Link to="/restablecer-contra" className="text-decoration-none">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                </div>
                <hr />

                <div className="col-auto">
                    <button type="button" className="btn btn-secondary btn2" onClick={navegarCuenta}>
                        Crear cuenta
                    </button>
                </div>
            </form>
            </div>
        </div>
    );
};

export default Login;
