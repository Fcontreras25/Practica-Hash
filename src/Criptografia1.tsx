import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';
import './criptografia.css';

const Criptografia1: React.FC = () => {
    const navigate = useNavigate();

    const generarPDF = async () => {
        const pdf = new jsPDF();

        // Dimensiones del PDF
        const anchoPagina = pdf.internal.pageSize.getWidth();
        const margenes = 15;

        // Agregar título centrado y en negritas
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(20);
        pdf.text("Criptografía - Introducción", anchoPagina / 2, 20, { align: "center" });

        // Agregar texto centrado debajo del título
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(12);
        const texto = "La criptografía asegura la privacidad de las comunicaciones a través del uso de métodos matemáticos complejos. Es fundamental en la seguridad informática actual.";
        pdf.text(texto, margenes, 40, {
            maxWidth: anchoPagina - 2 * margenes, // Ajustar el texto a los márgenes
            align: "justify", // Justificar el texto
        });

        // Agregar imagen centrada debajo del texto
        const imgSrc = "src/backend/recursos/logo.png"; // Ruta de la imagen
        const img = new Image();
        img.src = imgSrc;
        img.onload = () => {
            const imgWidth = 50; // Ancho de la imagen
            const imgHeight = 50; // Alto de la imagen
            const x = (anchoPagina - imgWidth) / 2; // Posición X centrada
            const y = 60; // Ajustar la posición Y debajo del texto
            pdf.addImage(img, 'PNG', x, y, imgWidth, imgHeight); // Agregar imagen
            pdf.save("criptografia1.pdf"); // Descargar PDF
        };
    };

    const regresar = () => {
        navigate('/bienvenida');
    };

    return (
        <div className="contenedor-criptografia">
            <div className="contenido-pdf">
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
