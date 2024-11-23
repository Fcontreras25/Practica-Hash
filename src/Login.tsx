import './index.css'
import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
    const navigate = useNavigate();

    const navegarCuenta = () => {
        navigate("/crear-cuenta");
      };
    

    return (
        <div className="contenedor-principal">
            <form className="contenedor-login">
                {/* Campo de Usuario */}
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Usuario"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                    />
                </div>

                {/* Campo de Contraseña */}
                <div className="col-auto mb-3">
                    <input
                        type="password"
                        className="form-control"
                        id="inputPassword2"
                        placeholder="Contraseña"
                    />
                </div>

                {/* Botón de Envío */}
                <div className="col-auto">
                    <button type="submit" className="btn btn-primary mb-3 btn1">
                        Iniciar sesión
                    </button>
                </div>

                {/* ¿Olvidaste tu contraseña? */}
                <div className="text-center mb-3">
                    <Link to="/restablecer-contra" className="text-decoration-none" >
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>

                {/* Línea divisoria */}
                <hr />

                {/* Botón de Crear cuenta */}
                <div className="col-auto">
                    <button type="button" className="btn btn-secondary btn2"  onClick={navegarCuenta}>
                        Crear cuenta
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Login;
