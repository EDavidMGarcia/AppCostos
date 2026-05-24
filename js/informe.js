// ========== MÓDULO INFORME PDF ==========
document.addEventListener('DOMContentLoaded', generarInforme);

function generarInforme() {
  const caratula = cargar('caratula') || {};
  const estudios = cargar('anteproyecto') || [];
  const computos = cargar('computos') || [];
  const capitulos = cargar('capitulos') || [];
  const aiu = cargar('aiu') || {};

  const totalDirectos = capitulos.reduce((s, c) => s + (c.valor || 0), 0);
  const adminPct = aiu.administracion || 0;
  const impPct = aiu.imprevistos || 0;
  const utilPct = aiu.utilidad || 0;
  const adminVal = totalDirectos * (adminPct / 100);
  const impVal = totalDirectos * (impPct / 100);
  const utilVal = totalDirectos * (utilPct / 100);
  const totalAIU = adminVal + impVal + utilVal;

  const totalEstudios = estudios.filter(e => e.incluido !== false).reduce((s, e) => s + (e.valor || 0), 0);
  const totalComputos = computos.reduce((s, c) => {
    const cant = c.cantidad || 0;
    const precio = c.precioUnitario || 0;
    const desp = c.desperdicio || 0;
    return s + (cant * precio * (1 + desp / 100));
  }, 0);

  const costoTotal = totalDirectos + totalAIU + totalEstudios + totalComputos;
  const costoPorM2 = caratula.areaConstruida > 0 ? costoTotal / caratula.areaConstruida : 0;

  function formatCOP(val) {
    return '$' + Math.round(val).toLocaleString('es-CO');
  }

  const html = `
    <style>
      @media print {
        body { font-size: 12pt; color: black; }
        table { width: 100%; border-collapse: collapse; margin: 1em 0; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background: #f0f0f0; }
        .seccion { margin-bottom: 2em; }
        h2 { border-bottom: 2px solid #1a6d5e; padding-bottom: 0.3em; }
      }
    </style>

    <h1 style="text-align:center; color:#1a6d5e">PRESUPUESTO DE OBRA</h1>
    <h2 style="text-align:center">${caratula.nombre || 'Proyecto'}</h2>
    <p style="text-align:center">Documento generado el ${new Date().toLocaleDateString('es-CO')}</p>

    <div class="seccion">
      <h2>1. Datos del Proyecto</h2>
      <p><strong>Proyecto:</strong> ${caratula.nombre || '-'}</p>
      <p><strong>Ubicación:</strong> ${caratula.ubicacion || '-'}</p>
      <p><strong>Propietario:</strong> ${caratula.propietario || '-'}</p>
      <p><strong>Constructor:</strong> ${caratula.constructor || '-'}</p>
      <p><strong>Área construida:</strong> ${caratula.areaConstruida || 0} m²</p>
      <p><strong>Normativa:</strong> ${caratula.normativa || '-'}</p>
      <p><strong>Fecha:</strong> ${caratula.fecha || '-'}</p>
    </div>

    <div class="seccion">
      <h2>2. Anteproyecto – Estudios Previos</h2>
      ${estudios.length > 0 ? `
        <table>
          <tr><th>Estudio</th><th>Valor</th></tr>
          ${estudios.filter(e => e.incluido !== false).map(e => `
            <tr><td>${e.nombre}</td><td>${formatCOP(e.valor)}</td></tr>
          `).join('')}
          <tr><td><strong>Total Estudios Previos</strong></td><td><strong>${formatCOP(totalEstudios)}</strong></td></tr>
        </table>
      ` : '<p>No se registraron estudios previos.</p>'}
    </div>

    <div class="seccion">
      <h2>3. Cómputos Métricos</h2>
      ${computos.length > 0 ? `
        <table>
          <tr><th>Descripción</th><th>Cant.</th><th>Precio Unit.</th><th>% Desp.</th><th>Total</th></tr>
          ${computos.map(c => `
            <tr>
              <td>${c.descripcion}</td>
              <td>${c.cantidad}</td>
              <td>${formatCOP(c.precioUnitario)}</td>
              <td>${c.desperdicio || 0}%</td>
              <td>${formatCOP(c.cantidad * c.precioUnitario * (1 + (c.desperdicio || 0) / 100))}</td>
            </tr>
          `).join('')}
          <tr><td colspan="4"><strong>Total Cómputos</strong></td><td><strong>${formatCOP(totalComputos)}</strong></td></tr>
        </table>
      ` : '<p>No se registraron cómputos métricos.</p>'}
    </div>

    <div class="seccion">
      <h2>4. Capítulos – Costos Directos</h2>
      ${capitulos.length > 0 ? `
        <table>
          <tr><th>Capítulo</th><th>Valor</th><th>%</th></tr>
          ${capitulos.map(c => `
            <tr>
              <td>${c.nombre}</td>
              <td>${formatCOP(c.valor)}</td>
              <td>${totalDirectos > 0 ? ((c.valor / totalDirectos) * 100).toFixed(1) : 0}%</td>
            </tr>
          `).join('')}
          <tr><td><strong>Total Costos Directos</strong></td><td><strong>${formatCOP(totalDirectos)}</strong></td><td>100%</td></tr>
        </table>
      ` : '<p>No se registraron capítulos.</p>'}
    </div>

    <div class="seccion">
      <h2>5. Costos Indirectos (AIU)</h2>
      <table>
        <tr><td>Administración (${adminPct}%)</td><td>${formatCOP(adminVal)}</td></tr>
        <tr><td>Imprevistos (${impPct}%)</td><td>${formatCOP(impVal)}</td></tr>
        <tr><td>Utilidad (${utilPct}%)</td><td>${formatCOP(utilVal)}</td></tr>
        <tr><td><strong>Total AIU</strong></td><td><strong>${formatCOP(totalAIU)}</strong></td></tr>
      </table>
    </div>

    <div class="seccion">
      <h2>6. Resumen General</h2>
      <table>
        <tr><td>Estudios Previos</td><td>${formatCOP(totalEstudios)}</td></tr>
        <tr><td>Cómputos Métricos</td><td>${formatCOP(totalComputos)}</td></tr>
        <tr><td>Costos Directos</td><td>${formatCOP(totalDirectos)}</td></tr>
        <tr><td>AIU</td><td>${formatCOP(totalAIU)}</td></tr>
        <tr style="background:#1a6d5e; color:white"><td><strong>COSTO TOTAL DEL PROYECTO</strong></td><td><strong>${formatCOP(costoTotal)}</strong></td></tr>
        ${costoPorM2 > 0 ? `<tr><td>Costo por m²</td><td>${formatCOP(costoPorM2)}/m²</td></tr>` : ''}
      </table>
    </div>

    <footer style="text-align:center; margin-top:2em; font-size:0.8em; color:#666">
      <p>Documento generado con PresupuestoPro • Normativa NSR-10 · POT Barranquilla · NTC</p>
    </footer>
  `;

  document.getElementById('informePreview').innerHTML = html;
}