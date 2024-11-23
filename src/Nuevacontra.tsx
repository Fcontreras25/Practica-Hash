import './nuevaContra.css';

function Nuevacontra() {
    return (
        <div className="contenedor-principal">
            <div className="contenedor-nuevacontra">
                <h2>Restablecimiento de Contraseña</h2>
                <p>
                    Ingresa una nueva contraseña para tu cuenta. La contraseña debe contener [...].
                    Confirma tu contraseña y podrás ingresar a tu cuenta.
                </p>

                {/* Campo de Nueva Contraseña */}
                <div className="campo">
                    <input
                        type="password"
                        className="form-control"
                        id="newPassword"
                        placeholder="Nueva Contraseña*"
                    />
                </div>

                {/* Campo de Confirmar Contraseña */}
                <div className="campo">
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        placeholder="Confirmar Contraseña*"
                    />
                </div>

                {/* Botones */}
                <div className="botones">
                    <button type="button" className="btn btn-cancelar">
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn-aceptar">
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Nuevacontra;
