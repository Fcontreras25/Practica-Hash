import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './layout.css';

const Layout: React.FC = () => {
    const location = useLocation(); // Detectar la ruta actual
    const navigate = useNavigate();

    // Función para cerrar sesión
    const cerrarSesion = () => {
        localStorage.removeItem('usuario'); // Eliminar usuario del almacenamiento local
        navigate('/'); // Redirigir al login
    };

    // Rutas donde se debe mostrar el header
    const rutasConHeader = ['/bienvenida', '/criptografia1', '/criptografia2', '/criptografia3'];

    return (
        <div className="layout-container">
            {/* Mostrar el header solo en las rutas indicadas */}
            {rutasConHeader.includes(location.pathname) && (
                <header className="header">
                    <img
                        src="src/backend/recursos/logo.png" // Ruta al logo
                        alt="Logotipo"
                        className="logo-header"
                    />
                    <button className="btn-cerrar-sesion" onClick={cerrarSesion}>
                        Cerrar Sesión
                    </button>
                </header>
            )}

            {/* Contenido principal */}
            <main className="main-content">
                <Outlet /> {/* Aquí se renderizan las páginas dinámicamente */}
            </main>

            {/* Footer */}
            <footer className="footer">
                <p>© 2024 Mi Aplicación. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default Layout;
