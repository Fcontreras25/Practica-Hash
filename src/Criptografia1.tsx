import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';
import './criptografia.css';

const Criptografia1: React.FC = () => {
    const navigate = useNavigate();
    const contentRef = useRef<HTMLDivElement>(null); // Referencia al contenido

    const generarPDF = async () => {
        const pdf = new jsPDF();
        const imgSrc = "src/backend/recursos/logo.png"; // Ruta de la imagen

        // Agregar texto
        pdf.setFontSize(16);
        pdf.text("Criptografía - Introducción", 10, 10);
        pdf.setFontSize(12);
        pdf.text(
            "La criptografía asegura la privacidad de las comunicaciones a través del uso de métodos matemáticos complejos. Es fundamental en la seguridad informática actual.",
            10,
            30,
            { maxWidth: 180 } // Ajusta el texto al ancho de la página
        );

        // Agregar la imagen
        const img = new Image();
        img.src = imgSrc;
        img.onload = () => {
            pdf.addImage(img, 'JPEG', 10, 50, 50, 50); // Posición x, y y tamaño de la imagen
            pdf.save("criptografia1.pdf"); // Descargar el PDF
        };
    };

    const regresar = () => {
        navigate('/bienvenida');
    };

    return (
        <div className="contenedor-criptografia">
            <div ref={contentRef} className="contenido-pdf">
                <h2>Criptografía - Introducción</h2>
                <p>
                    La criptografía asegura la privacidad de las comunicaciones a través del uso de métodos matemáticos complejos. Es fundamental en la seguridad informática actual.
                </p>
                <img src="src/backend/recursos/logo.png" alt="Introducción a la criptografía" className="imagen-criptografia" />
            </div>
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

export default Criptografia1;
