import React from "react";
import jsPDF from "jspdf";
import "./criptografia.css";

const Criptografia2: React.FC = () => {
    const generarPDF = () => {
        const pdf = new jsPDF();
        const anchoPagina = pdf.internal.pageSize.getWidth();
        const margenes = 15;

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(20);
        pdf.text("Criptografía - Historia", anchoPagina / 2, 20, { align: "center" });

        const contenidoElemento = document.querySelector('.contenido-pdf-cripto2');
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
            pdf.save("criptografia2.pdf");
        };
    };

    return (
        <div className="contenido-pdf-cripto2 criptografia-container">
            <h2 className="titulo">Criptografía - Historia</h2>
            <p>
                La historia de la criptografía se remonta a tiempos antiguos, cuando las civilizaciones usaban técnicas primitivas para proteger
                mensajes sensibles durante guerras y conflictos. Los egipcios, por ejemplo, usaban códigos jeroglíficos para ocultar mensajes importantes.
            </p>
            <p>
                Con el tiempo, la criptografía evolucionó, destacando figuras como Julio César, quien desarrolló el "Cifrado César". Este método consistía
                en desplazar letras del alfabeto un número fijo de posiciones. Durante la Segunda Guerra Mundial, la máquina Enigma utilizada por los
                nazis representó un hito en la criptografía moderna.
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

export default Criptografia2;
