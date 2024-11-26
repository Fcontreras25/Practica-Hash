import React from "react";
import jsPDF from "jspdf";
import "./criptografia.css";

const Criptografia1: React.FC = () => {
    const generarPDF = () => {
        const pdf = new jsPDF();
        const anchoPagina = pdf.internal.pageSize.getWidth();
        const margenes = 15;

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(20);
        pdf.text("Criptografía - Introducción", anchoPagina / 2, 20, { align: "center" });

        const contenidoElemento = document.querySelector('.contenido-pdf-cripto1');
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
            pdf.save("criptografia1.pdf");
        };
    };

    return (
        <div className="contenido-pdf-cripto1 criptografia-container">
            <h2 className="titulo">Criptografía - Introducción</h2>
            <p>
                El Códice Voynich es uno de los manuscritos más enigmáticos y fascinantes de la historia. Se cree que fue creado entre 1404 y 1438,
                aunque su autor sigue siendo un misterio. Este manuscrito, que toma su nombre del comerciante de libros antiguos Wilfrid Voynich,
                quien lo adquirió en 1912, está escrito en un idioma desconocido, denominado "voynichés". Este idioma ha desconcertado a criptógrafos
                y lingüistas durante más de un siglo, debido a su complejidad y estructura única.
            </p>
            <p>
                El contenido del códice es igualmente intrigante. Está dividido en varias secciones que incluyen ilustraciones de plantas exóticas,
                diagramas astronómicos y zodiacales, y figuras femeninas en actividades misteriosas. A pesar de numerosos intentos por descifrarlo,
                nadie ha podido entender completamente su significado o propósito. Esto ha llevado a muchas teorías, desde la posibilidad de que
                sea un libro de alquimia o medicina, hasta la idea de que podría ser simplemente una elaborada broma o estafa.
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

export default Criptografia1;
