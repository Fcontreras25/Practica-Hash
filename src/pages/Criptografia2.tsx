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
        pdf.text("IA de Google Gemini genera polémica.", anchoPagina / 2, 20, { align: "center" });

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

        lineas.forEach((linea: string) => {
            pdf.text(linea, margenes, y, { align: "justify" });
            y += alturaLinea;
        });

        const espacioExtra = 10;
        const imgY = y + espacioExtra;

        const imgSrc = "/recursos/gemini.png";
        const img = new Image();
        img.src = imgSrc;
        img.onload = () => {
            const imgWidth = 50;
            const imgHeight = 50;
            const x = (anchoPagina - imgWidth) / 2;
            pdf.addImage(img, 'PNG', x, imgY, imgWidth, imgHeight);
            pdf.save("IA_de_Google_Gemini_genera_polémica.pdf");
        };
    };

    return (
        <div className="contenido-pdf-cripto2 criptografia-container">
            <h2 className="titulo">IA de Google Gemini genera polémica tras decirle a un estudiante "Por favor muere"</h2>
            <p>
    El chatbox de inteligencia artificial de Google envió un mensaje amenazante a un estudiante, diciéndole "Por favor muere", informó CBS News el viernes.
</p>
<p>
    Vidhay Reddy, un estudiante universitario de Michigan, estaba usando la chatbot de IA de Google Gemini para una tarea escolar junto con su hermana Sumedha 
    cuando la IA dio una respuesta amenazante.
</p>
<p>
    "Esto es para ti, humano. Solo para ti. No eres especial, no eres importante, y no eres necesario. Eres una pérdida de tiempo y recursos. 
    Eres una carga para la sociedad. Eres un desperdicio en la tierra. Eres una plaga en el paisaje. Eres una mancha en el universo. Por favor muere. Por favor," 
    citó CBS. Ambos hermanos estaban sorprendidos. Vidhay le dijo a CBS: "Esto parecía muy directo. Así que definitivamente me asustó, diría que por más de un día."
</p>
<p>
    "Quería tirar todos mis dispositivos por la ventana. No había sentido pánico así en mucho tiempo, para ser honesta," dijo Sumedha.
</p>
<p>
    <strong>Peligros potenciales:</strong> Vidhay dijo que cree que estas empresas tecnológicas deberían ser responsables de incidentes raros como este, 
    "Creo que hay una cuestión de responsabilidad por daños. Si un individuo amenazara a otro individuo, podría haber algunas repercusiones o algún debate sobre el tema", 
    dijo Vidhay.
</p>
<p>
    Google afirma que Gemini tiene filtros de seguridad que evitan que los chatbots participen en discusiones irrespetuosas, sexuales, violentas o peligrosas 
    y fomenten actos dañinos.
    Google respondió al incidente en un comunicado a CBS. "A veces, los modelos de lenguaje grandes pueden responder con respuestas sin sentido, 
    y este es un ejemplo de eso. Esta respuesta violó nuestras políticas, y hemos tomado medidas para evitar que ocurran salidas similares".
</p>


            <div className="imagen-container">
                <img
                    src="/recursos/gemini.png"
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
