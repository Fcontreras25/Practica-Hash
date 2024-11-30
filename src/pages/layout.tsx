import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './layout.css';
import logo from '@/backend/recursos/logo.png';

const Layout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const cerrarSesion = () => {
        localStorage.removeItem('usuario'); // Eliminar usuario del almacenamiento local
        navigate('/'); // Redirigir al login
    };

    const rutasConHeader = ['/bienvenida', '/criptografia1', '/criptografia2', '/criptografia3'];

    return (
        <div className="layout-container">
            {rutasConHeader.includes(location.pathname) && (
                <header className="header">
                    <img
                        src={logo}
                        alt="Logotipo"
                        className="logo-header"
                    />
                    <button className="btn-cerrar-sesion" onClick={cerrarSesion}>
                        Cerrar Sesión
                    </button>
                </header>
            )}

            <main className="main-content">
                <Outlet />
            </main>

            <footer className="footer">
                <img
                    src={logo}
                    alt="Logotipo del Footer"
                    className="logo-footer"
                />
                <p>© 2024 CipherTech una división de Capsule Corp. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default Layout;
