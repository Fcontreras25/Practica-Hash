import React from 'react';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';
import './criptografia.css';

const Criptografia3: React.FC = () => {
    const navigate = useNavigate();

    const generarPDF = () => {
        const doc = new jsPDF();
        doc.text("Criptografía - Métodos Modernos", 10, 10);
        doc.text(
            "Los métodos modernos de criptografía incluyen algoritmos como AES y RSA. Estos garantizan una seguridad robusta y son ampliamente utilizados en internet para proteger transacciones y datos personales.",
            10,
            20
        );
        doc.save("criptografia3.pdf");
    };

    const regresar = () => {
        navigate('/bienvenida');
    };

    return (
        <div className="contenedor-criptografia">
            <h2>Criptografía - Métodos Modernos</h2>
            <p>
                En la actualidad, algoritmos como AES, RSA y SHA-256 son estándares en la criptografía moderna, ofreciendo un nivel de seguridad inquebrantable.
            </p>
            <img src="ruta_a_tu_imagen3.jpg" alt="Métodos modernos de criptografía" className="imagen-criptografia" />
            <div className="botones">
                <button className="btn-pdf" onClick={generarPDF}>
                    Generar PDF
                </button>
                <button className="btn-regresar" onClick={regresar}>
                    Regresar
                </button>
            </div>
        </div>
    );
};

export default Criptografia3;
