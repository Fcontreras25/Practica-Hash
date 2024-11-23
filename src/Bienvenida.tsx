import React from 'react';
import './bienvenida.css';

const Bienvenida: React.FC = () => {
    const usuario = localStorage.getItem('usuario'); // Recupera el usuario del almacenamiento local

    return (
        <div className="contenedor-bienvenida">
            <div className='contenedor-info'>
                <h3>¡Bienvenido, {usuario}!</h3>
                <p>Estamos felices de verte nuevamente.</p>
                <p>Estamos son los datos nuevos de esta semana.</p>
                <div className="contenedor-datos">
                    <ul>
                        <li><a href="#">dato 1</a></li>
                        <li><a href="#">dato 3</a></li>
                        <li><a href="#">dato 2</a></li>
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default Bienvenida;
