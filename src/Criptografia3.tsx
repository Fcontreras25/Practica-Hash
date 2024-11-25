import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';
import './criptografia.css';

const Criptografia3: React.FC = () => {
    const navigate = useNavigate();

    const generarPDF = async () => {
        const pdf = new jsPDF();

        // Dimensiones del PDF
        const anchoPagina = pdf.internal.pageSize.getWidth();
        const margenes = 15;

        // Agregar título centrado y en negritas
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(20);
        pdf.text("Criptografía - Métodos Modernos", anchoPagina / 2, 20, { align: "center" });

        // Agregar texto justificado debajo del título
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(12);
        const texto = "Los métodos modernos de criptografía incluyen algoritmos como AES y RSA. Estos garantizan una seguridad robusta y son ampliamente utilizados en internet para proteger transacciones y datos personales.";
        pdf.text(texto, margenes, 40, {
            maxWidth: anchoPagina - 2 * margenes,
            align: "justify",
        });

        // Agregar imagen centrada debajo del texto
        const imgSrc = "src/backend/recursos/logo.png"; // Ruta de la imagen
        const img = new Image();
        img.src = imgSrc;
        img.onload = () => {
            const imgWidth = 50;
            const imgHeight = 50;
            const x = (anchoPagina - imgWidth) / 2;
            const y = 60;
            pdf.addImage(img, 'PNG', x, y, imgWidth, imgHeight);
            pdf.save("criptografia3.pdf");
        };
    };

    const regresar = () => {
        navigate('/bienvenida');
    };

    return (
        <div className="contenedor-criptografia">
            <div className="contenido-pdf">
                <h2>Criptografía - Métodos Modernos</h2>
                <p>
                    Los métodos modernos de criptografía incluyen algoritmos como AES y RSA. Estos garantizan una seguridad robusta y son ampliamente utilizados en internet para proteger transacciones y datos personales.
                </p>
                <img src="src/backend/recursos/logo.png" alt="Métodos Modernos de Criptografía" className="imagen-criptografia" />
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

export default Criptografia3;
