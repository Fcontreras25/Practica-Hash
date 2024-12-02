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
        pdf.text("Los tres nuevos cifrados de IBM, invencibles ante hackers", anchoPagina / 2, 20, { align: "center" });

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

        lineas.forEach((linea: string) => {
            pdf.text(linea, margenes, y, { align: "justify" });
            y += alturaLinea;
        });

        const espacioExtra = 10;
        const imgY = y + espacioExtra;

        const imgSrc = "/recursos/candado.png";
        const img = new Image();
        img.src = imgSrc;
        img.onload = () => {
            const imgWidth = 50;
            const imgHeight = 50;
            const x = (anchoPagina - imgWidth) / 2;
            pdf.addImage(img, 'PNG', x, imgY, imgWidth, imgHeight);
            pdf.save("Los_tres_nuevos_cifrados_de_IBM.pdf");
        };
    };

    return (
        <div className="contenido-pdf-cripto3 criptografia-container">
            <h2 className="titulo">No hay hacker en el mundo que pueda vencer a los tres nuevos cifrados inventados por IBM</h2>
            <p>
    Los ordenadores cuánticos ofrecen soluciones a problemas extremadamente complejos, pero también representan un riesgo potencial si cibercriminales o actores geopolíticos los usan para ataques. Ante este desafío, es crucial fortalecer la ciberseguridad con estándares que protejan la información frente a estas nuevas amenazas.
</p>
<p>
    IBM ha dado un paso importante en esta dirección con el anuncio de que el Instituto Nacional de Normas y Tecnología (NIST) ha publicado los primeros tres estándares de cifrado cuántico del mundo. Estos estándares son algoritmos criptográficos diseñados para resistir los ataques de computación cuántica, asegurando la protección de datos sensibles.
</p>
<p>
    El desarrollo de estos algoritmos comenzó en 2016, cuando el NIST invitó a expertos globales a proponer soluciones de criptografía post-cuántica. De 69 propuestas iniciales, se seleccionaron cuatro en 2022 para un análisis exhaustivo, y tres de ellas han sido ahora adoptadas como estándares oficiales:
</p>
<ul>
    <li>
        <strong>ML-KEM:</strong> Un mecanismo de encapsulación de claves diseñado para aplicaciones generales, como el acceso seguro a sitios web.
    </li>
    <li>
        <strong>ML-DSA:</strong> Un algoritmo basado en redes, ideal para protocolos de firma digital de propósito general.
    </li>
    <li>
        <strong>SLH-DSA:</strong> Un esquema de firma digital basado en hash sin estado, que garantiza una autenticación robusta.
    </li>
</ul>
<p>
    Estos algoritmos reemplazarán tecnologías como RSA, que son vulnerables a los avances de la computación cuántica. Con su implementación, se espera que incluso un hacker con acceso a un ordenador cuántico no pueda comprometer la seguridad de datos de empresas u organismos públicos.
</p>
<p>
    IBM planea consolidar su liderazgo en la era cuántica mediante el lanzamiento de su primer sistema cuántico con corrección de errores en 2029, el cual será capaz de realizar cientos de millones de operaciones cuánticas para resolver problemas complejos. Su hoja de ruta también incluye la expansión de este sistema para ejecutar más de mil millones de operaciones cuánticas para 2033, marcando un avance significativo en la computación de alta precisión.
    Estos nuevos estándares no solo aseguran la información actual frente a amenazas futuras, sino que también sientan las bases para un entorno digital más seguro en la era cuántica.
</p>

            <div className="imagen-container">
                <img
                    src="/recursos/candado.png"
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
