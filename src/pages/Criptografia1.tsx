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
        pdf.text("Manuscrito Voynich", anchoPagina / 2, 20, { align: "center" });

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

        lineas.forEach((linea: string) => {
            pdf.text(linea, margenes, y, { align: "justify" });
            y += alturaLinea;
        });

        const espacioExtra = 10;
        const imgY = y + espacioExtra;

        const imgSrc = "/recursos/manuscrito.png";
        const img = new Image();
        img.src = imgSrc;
        img.onload = () => {
            const imgWidth = 50;
            const imgHeight = 50;
            const x = (anchoPagina - imgWidth) / 2;
            pdf.addImage(img, 'PNG', x, imgY, imgWidth, imgHeight);
            pdf.save("Manuscrito_Voynich.pdf");
        };
    };

    return (
        <div className="contenido-pdf-cripto1 criptografia-container">
            <h2 className="titulo">Manuscrito Voynich</h2>
            <p>
    ¿De dónde viene el manuscrito Voynich? La primera noticia de la existencia del Voynich data de 1580, 
    cuando el emperador Rodolfo II de Habsburgo, muy interesado en las ciencias ocultas, la magia y las 
    rarezas de todo tipo, lo adquirió por la elevada suma de 600 ducados a los ingleses John Dee –un mago 
    que decía comunicarse con los ángeles mediante unas piedras– y Edward Kelley, un embaucador.
</p>
<p>
    En el siglo XVII el manuscrito pasó por varias manos hasta quedar depositado en el convento franciscano 
    de Mondragone, en Italia, donde en 1912 lo compró el tratante de antigüedades Wilfrid Voynich, de quien 
    toma el nombre. En 1931, su viuda lo vendió a un anticuario neoyorquino, Hans Peter Kraus, que no consiguió 
    revenderlo y terminó regalándolo a la Universidad de Yale en 1969.
</p>
<p>
    <strong>Intentos de descifrarlo:</strong> Desde el siglo XVI, muchos investigadores han tratado de descifrar 
    el Voynich. Lo intentaron en el siglo XVII el alquimista Jacobus Horcicky de Tepenecz, el bibliotecario imperial 
    Georg Barsche y el profesor de la Universidad de Praga Johannes Marcus Marci. Se envió al jesuita Athanasius Kircher, 
    famoso por sus intentos de descifrar los jeroglíficos del antiguo Egipto, pero aquél no respondió al reto.
</p>

<p>
    Para intentar descifrarlo se han aplicado técnicas tradicionales, como sustituir una letra por otra o asignarles un 
    valor numérico, pero sin resultado coherente. Se han usado tarjetas perforadas, ya conocidas en 1500 por Girolamo Cardano, 
    y programas de ordenador, que han dado lugar a cientos de miles de combinaciones posibles, también sin resultado. 
    Si se trata de un libro encriptado, sus claves son tan intrincadas que nadie ha conseguido descifrarlas. Por eso se ha 
    sugerido que está escrito en un lenguaje oculto no conocido, al que se ha dado nombre: el voynichés. Y según se desprende 
    de las ilustraciones, el texto contendría relatos esotéricos sobre ritos ocultos; y los dibujos de plantas, astros y 
    mujeres serían símbolos alquímicos.
</p>


            <div className="imagen-container">
                <img
                    src="/recursos/manuscrito.png"
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
