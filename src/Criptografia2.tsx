import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';
import './criptografia.css';

const Criptografia2: React.FC = () => {
    const navigate = useNavigate();
    const contentRef = useRef<HTMLDivElement>(null);

    const generarPDF = async () => {
        if (contentRef.current) {
            const canvas = await html2canvas(contentRef.current);
            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('criptografia2.pdf');
        }
    };

    const regresar = () => {
        navigate('/bienvenida');
    };

    return (
        <div className="contenedor-criptografia">
            <div ref={contentRef} className="contenido-pdf">
                <h2>Criptografía - Métodos Clásicos</h2>
                <p>
                    Métodos como el cifrado César y el de Vigenère son ejemplos históricos de cómo se protegía la información antes de la era digital.
                </p>
                <img src="ruta_a_tu_imagen2.jpg" alt="Métodos clásicos de criptografía" className="imagen-criptografia" />
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

export default Criptografia2;
