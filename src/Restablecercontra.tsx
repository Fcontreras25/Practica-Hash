import './restablecerContra.css';
import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';

const Restablecercontra: React.FC = () => {
    const [usuario, setUsuario] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    const navegarLogin = () => {
        navigate("/");
    };

    const enviarUsuario = async () => {
        setMensaje(''); // Limpiar mensajes previos
        setError('');
        console.log(`Usuario enviado: ${usuario}`); 
        try {
            const response = await fetch('http://localhost:3000/verificarUsuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usuario }),
            });
            const data = await response.json();

            if (response.ok) {
                // Mostrar mensaje de éxito
                setMensaje(data.mensaje || 'Hemos enviado un correo con las instrucciones para restablecer tu contraseña.');
                if (data.codigoEspecial) {
                    console.log(`Código especial generado: ${data.codigoEspecial}`);
                }
            } else {
                // Mostrar mensaje de error enviado por el servidor
                setError(data.error || 'Ocurrió un error al procesar tu solicitud.');
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setError('Hubo un problema al conectarse con el servidor.');
        }
    };

    return (
        <div className="contenedor-principal">
            <div className="contenedor-restablecer">
                <h4>
                    Si olvidaste tu contraseña, puedes restablecerla ingresando tu usuario aquí.
                    Se te enviará un correo donde podrás cambiar tu contraseña.
                </h4>

                {/* Campo de Usuario */}
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

                {/* Botones */}
                <div className="botones">
                    <button type="button" className="btn btn-cancelar" onClick={navegarLogin}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn-aceptar" onClick={enviarUsuario}>
                        Aceptar
                    </button>
                </div>

                {/* Mensajes */}
                {mensaje && <p style={{ color: 'green', marginTop: '20px' }}>{mensaje}</p>}
                {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
            </div>
        </div>
    );
};

export default Restablecercontra;
