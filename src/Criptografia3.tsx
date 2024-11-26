import React from "react";
import jsPDF from "jspdf";
import "./criptografia.css";

const Criptografia3: React.FC = () => {
    const generarPDF = () => {
        const pdf = new jsPDF();
        const anchoPagina = pdf.internal.pageSize.getWidth();
        const margenes = 15;

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(20);
        pdf.text("Criptografía - Aplicaciones", anchoPagina / 2, 20, { align: "center" });

        const contenidoElemento = document.querySelector('.contenido-pdf-cripto3');
        if (!contenidoElemento) {
            console.error('No se encontró el contenido a exportar.');
            return;
        }

        const texto = Array.from(contenidoElemento.querySelectorAll('p'))
            .map((p) => p.innerText)
            .join('\n\n');

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(12);
        const lineas = pdf.splitTextToSize(texto, anchoPagina - 2 * margenes);
        const alturaLinea = 7;
        let y = 40;

        lineas.forEach((linea) => {
            pdf.text(linea, margenes, y, { align: "justify" });
            y += alturaLinea;
        });

        const espacioExtra = 10;
        const imgY = y + espacioExtra;

        const imgSrc = "src/backend/recursos/logo.png";
        const img = new Image();
        img.src = imgSrc;
        img.onload = () => {
            const imgWidth = 50;
            const imgHeight = 50;
            const x = (anchoPagina - imgWidth) / 2;
            pdf.addImage(img, 'PNG', x, imgY, imgWidth, imgHeight);
            pdf.save("criptografia3.pdf");
        };
    };

    return (
        <div className="contenido-pdf-cripto3 criptografia-container">
            <h2 className="titulo">Criptografía - Aplicaciones</h2>
            <p>
                Hoy en día, la criptografía tiene aplicaciones en múltiples áreas, como las transacciones bancarias, la protección de datos personales,
                las comunicaciones seguras y el blockchain. La criptografía de clave pública y los algoritmos como RSA y ECC son fundamentales en la
                seguridad de internet.
            </p>
            <p>
                Además, las redes privadas virtuales (VPN), los certificados SSL/TLS y las firmas digitales son ejemplos claros de cómo la criptografía
                protege la información en entornos digitales modernos, garantizando la privacidad y la autenticidad.
            </p>
            <div className="imagen-container">
                <img
                    src="src/backend/recursos/logo.png"
                    alt="Logotipo de criptografía"
                    className="imagen-cripto"
                />
            </div>
            <div className="botones">
                <button className="btn btn-pdf" onClick={generarPDF}>Generar PDF</button>
                <button className="btn btn-regresar" onClick={() => window.history.back()}>Regresar</button>
            </div>
        </div>
    );
};

export default Criptografia3;
