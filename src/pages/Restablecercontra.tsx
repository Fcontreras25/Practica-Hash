import './restablecerContra.css';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

const Restablecercontra: React.FC = () => {
    const [usuario, setUsuario] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const enviarUsuario = async () => {
        setMensaje('');
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/verificarUsuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usuario }),
            });

            const data = await response.json();
            setIsLoading(false);

            if (response.ok) {
                setMensaje(data.mensaje || 'Correo enviado con las instrucciones para restablecer tu contraseña.');
            } else {
                setError(data.error || 'Ocurrió un error al procesar tu solicitud.');
            }
        } catch (err) {
            setIsLoading(false);
            console.error('Error al conectar con el servidor:', err);
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

                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                    />
                </div>

                <div className="botones">
                    <button type="button" className="btn btn-cancelar" onClick={() => navigate('/')}>
                        Cancelar
                    </button>
                    <button type="button" className="btn btn-aceptar" onClick={enviarUsuario}>
                        Aceptar
                    </button>
                </div>

                {isLoading && <p style={{ color: '#223ba0', marginTop: '20px' }}>Procesando, por favor espera...</p>}
                {mensaje && <p style={{ color: 'green', marginTop: '20px' }}>{mensaje}</p>}
                {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
            </div>
        </div>
    );
};

export default Restablecercontra;
