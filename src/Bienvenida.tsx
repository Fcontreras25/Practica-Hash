import React from 'react';
import './bienvenida.css';
import { Link } from 'react-router-dom';

const Bienvenida: React.FC = () => {
    const usuario = localStorage.getItem('usuario'); // Recupera el usuario del almacenamiento local

    return (
        <div className="contenedor-bienvenida">
            <div className="contenedor-info">
                <h3>¡Bienvenido, {usuario || 'Usuario'}!</h3>
                <p>Estamos felices de verte nuevamente.</p>
                <p>Estos son los datos nuevos de esta semana:</p>

                <div className="contenedor-datos">
                    <ul>
                        <li><Link to="/criptografia1">dato 1</Link></li>
                        <li><Link to="/criptografia2">dato 2</Link></li>
                        <li><Link to="/criptografia3">dato 3</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Bienvenida;
