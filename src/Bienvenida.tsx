import React from 'react';
import './bienvenida.css';

const Bienvenida: React.FC = () => {
    const usuario = localStorage.getItem('usuario'); // Recupera el usuario del almacenamiento local

    return (
        <div className="contenedor-bienvenida">
            <h1>¡Bienvenido, {usuario}!</h1>
            <p>Estamos felices de verte nuevamente.</p>
            <p>Estamos son los datos nuevos de esta semana.</p>
            <div className='contenedor-datos'>
                <a>dato 1</a>
                <a>dato 3</a>
                <a>dato 2</a>
            </div>
        </div>
    );
};

export default Bienvenida;
