document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM del formulario
    const declaracionForm = document.getElementById('declaracionForm');
    const aceptarJuramentoCheckbox = document.getElementById('aceptarJuramento');
    const productosSAGCheckbox = document.getElementById('productosSAG');
    const detalleSAGTextarea = document.getElementById('detalleSAG');
    const incluyeMenoresCheckbox = document.getElementById('incluyeMenores');
    const numHombresMenoresInput = document.getElementById('numHombresMenores');
    const numMujeresMenoresInput = document.getElementById('numMujeresMenores');
    const mercanciasAduanaCheckbox = document.getElementById('mercanciasAduana');
    const detalleMercanciasTextarea = document.getElementById('detalleMercancias');

    // Referencias a elementos del DOM del modal de reporte
    const reporteModal = document.getElementById('reporteModal');
    const closeModalBtn = document.querySelector('.close-button');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');

    // Elementos del reporte dentro del modal para llenar dinámicamente
    const reportNombres = document.getElementById('reportNombres');
    const reportApellidos = document.getElementById('reportApellidos');
    const reportGenero = document.getElementById('reportGenero');
    const reportNacionalidad = document.getElementById('reportNacionalidad');
    const reportPaisProcedencia = document.getElementById('reportPaisProcedencia');
    const reportDireccionChile = document.getElementById('reportDireccionChile');
    const reportTipoDocumento = document.getElementById('reportTipoDocumento');
    const reportNumeroDocumento = document.getElementById('reportNumeroDocumento');
    const reportRut = document.getElementById('reportRut');
    const reportLugarIngreso = document.getElementById('reportLugarIngreso');
    const reportMedioTransporte = document.getElementById('reportMedioTransporte');
    const reportMercanciasAduana = document.getElementById('reportMercanciasAduana');
    const reportDetalleMercancias = document.getElementById('reportDetalleMercancias');
    const reportMonedaExtranjera = document.getElementById('reportMonedaExtranjera');
    const reportProductosSAG = document.getElementById('reportProductosSAG');
    const reportDetalleSAG = document.getElementById('reportDetalleSAG');
    const reportIncluyeMenores = document.getElementById('reportIncluyeMenores');
    const reportNumHombresMenores = document.getElementById('reportNumHombresMenores');
    const reportNumMujeresMenores = document.getElementById('reportNumMujeresMenores');
    const reportFormId = document.getElementById('reportFormId'); // Asegúrate de que este elemento exista en el HTML

    const generateUniqueId = () => {
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `DEC-ADU-SAG-${year}${month}${day}-${randomString}`;
    };

    const generatedId = generateUniqueId();
    document.getElementById('formIdDisplay').textContent = generatedId;

    const toggleDetalleSAG = () => {
        detalleSAGTextarea.required = productosSAGCheckbox.checked;
        if (!productosSAGCheckbox.checked) {
            detalleSAGTextarea.value = '';
            detalleSAGTextarea.placeholder = 'No aplica';
            detalleSAGTextarea.setAttribute('readonly', 'readonly');
        } else {
            detalleSAGTextarea.removeAttribute('readonly');
            detalleSAGTextarea.placeholder = 'Ej: 2 manzanas, un poco de miel, queso.';
        }
    };

    const toggleMenoresInput = () => {
        const isRequired = incluyeMenoresCheckbox.checked;
        numHombresMenoresInput.required = isRequired;
        numMujeresMenoresInput.required = isRequired;

        if (!isRequired) {
            numHombresMenoresInput.value = '';
            numMujeresMenoresInput.value = '';
            numHombresMenoresInput.placeholder = '#';
            numMujeresMenoresInput.placeholder = '#';
            numHombresMenoresInput.removeAttribute('required');
            numMujeresMenoresInput.removeAttribute('required');
        } else {
            numHombresMenoresInput.placeholder = 'Número de hombres menores';
            numMujeresMenoresInput.placeholder = 'Número de mujeres menores';
        }
    };

    const toggleDetalleMercancias = () => {
        if (!mercanciasAduanaCheckbox.checked) {
            detalleMercanciasTextarea.value = '';
            detalleMercanciasTextarea.placeholder = 'No aplica';
            detalleMercanciasTextarea.setAttribute('readonly', 'readonly');
        } else {
            detalleMercanciasTextarea.removeAttribute('readonly');
            detalleMercanciasTextarea.placeholder = 'Ej: 1 Tablet nueva, regalos por valor de US$400, etc.';
        }
    };

    productosSAGCheckbox.addEventListener('change', toggleDetalleSAG);
    incluyeMenoresCheckbox.addEventListener('change', toggleMenoresInput);
    mercanciasAduanaCheckbox.addEventListener('change', toggleDetalleMercancias);

    toggleDetalleSAG();
    toggleMenoresInput();
    toggleDetalleMercancias();

    declaracionForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!aceptarJuramentoCheckbox.checked) {
            alert('Debe aceptar la declaración bajo juramento para continuar.');
            return;
        }

        if (productosSAGCheckbox.checked && detalleSAGTextarea.value.trim() === '') {
            alert('Por favor, detalle los productos de origen vegetal o animal que trae.');
            detalleSAGTextarea.focus();
            return;
        }

        if (incluyeMenoresCheckbox.checked) {
            if (numHombresMenoresInput.value === '' && numMujeresMenoresInput.value === '') {
                alert('Por favor, indique el número de hombres o mujeres menores incluidos en la declaración, o escriba 0 si no hay.');
                numHombresMenoresInput.focus();
                return;
            }
        }

        // 🔧 FIX: Reemplazo de formIdInput por formIdDisplay
        const formId = document.getElementById('formIdDisplay').textContent || '#';

        const nombres = document.getElementById('nombres').value || '#';
        const apellidos = document.getElementById('apellidos').value || '#';
        const genero = document.querySelector('input[name="genero"]:checked')?.value || '#';
        const nacionalidad = document.getElementById('nacionalidad').value || '#';
        const paisProcedencia = document.getElementById('paisProcedencia').value || '#';
        const direccionChile = document.getElementById('direccionChile').value || '#';
        const tipoDocumento = document.getElementById('tipoDocumento').value || '#';
        const numeroDocumento = document.getElementById('numeroDocumento').value || '#';
        const rut = document.getElementById('rut').value || '#';
        const lugarIngreso = document.getElementById('lugarIngreso').value || '#';
        const medioTransporte = document.getElementById('medioTransporte').value || '#';

        const mercanciasAduana = mercanciasAduanaCheckbox.checked ? 'Sí' : 'No';
        const detalleMercancias = mercanciasAduanaCheckbox.checked && detalleMercanciasTextarea.value.trim() !== '' ? detalleMercanciasTextarea.value : 'No aplica / No especificado';
        const monedaExtranjera = document.getElementById('monedaExtranjera').checked ? 'Sí' : 'No';

        const productosSAG = productosSAGCheckbox.checked ? 'Sí' : 'No';
        const detalleSAG = productosSAGCheckbox.checked && detalleSAGTextarea.value.trim() !== '' ? detalleSAGTextarea.value : 'No aplica / No especificado';
        const incluyeMenores = incluyeMenoresCheckbox.checked ? 'Sí' : 'No';
        const numHombresMenores = incluyeMenoresCheckbox.checked && numHombresMenoresInput.value !== '' ? numHombresMenoresInput.value : '0';
        const numMujeresMenores = incluyeMenoresCheckbox.checked && numMujeresMenoresInput.value !== '' ? numMujeresMenoresInput.value : '0';

        reportNombres.textContent = nombres;
        reportApellidos.textContent = apellidos;
        reportGenero.textContent = genero;
        reportNacionalidad.textContent = nacionalidad;
        reportPaisProcedencia.textContent = paisProcedencia;
        reportDireccionChile.textContent = direccionChile;
        reportTipoDocumento.textContent = tipoDocumento;
        reportNumeroDocumento.textContent = numeroDocumento;
        reportRut.textContent = rut;
        reportLugarIngreso.textContent = lugarIngreso;
        reportMedioTransporte.textContent = medioTransporte;

        reportMercanciasAduana.textContent = mercanciasAduana;
        reportDetalleMercancias.textContent = detalleMercancias;
        reportMonedaExtranjera.textContent = monedaExtranjera;

        reportProductosSAG.textContent = productosSAG;
        reportDetalleSAG.textContent = detalleSAG;
        reportIncluyeMenores.textContent = incluyeMenores;
        reportNumHombresMenores.textContent = numHombresMenores;
        reportNumMujeresMenores.textContent = numMujeresMenores;
        reportFormId.textContent = formId;

        reporteModal.style.display = 'flex';

        console.log('Datos del formulario enviados (simulado):', {
            formId, nombres, apellidos, genero, nacionalidad, paisProcedencia,
            direccionChile, tipoDocumento, numeroDocumento, rut, lugarIngreso, medioTransporte,
            mercanciasAduana, detalleMercancias, monedaExtranjera,
            productosSAG, detalleSAG, incluyeMenores, numHombresMenores, numMujeresMenores
        });
    });

    closeModalBtn.addEventListener('click', () => {
        reporteModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === reporteModal) {
            reporteModal.style.display = 'none';
        }
    });

    downloadPdfBtn.addEventListener('click', () => {
        const formId = reportFormId.textContent;

        const pdfContent = `
        --- REPORTE DE DECLARACIÓN JURADA CONJUNTA SAG Y ADUANAS ---
        ID de Formulario: ${formId}
        (contenido simulado para descarga)
        `;

        const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Declaracion_Conjunta_SAG_Aduanas_${formId}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert('Descarga de reporte simulada. Revisa tus descargas.');
    });
});
