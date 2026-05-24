// ========== MÓDULO AIU ==========
document.addEventListener('DOMContentLoaded', () => {
  cargarAIU();
  document.getElementById('porcAdmin').addEventListener('input', actualizarAIU);
  document.getElementById('porcImprevistos').addEventListener('input', actualizarAIU);
  document.getElementById('porcUtilidad').addEventListener('input', actualizarAIU);
  document.getElementById('guardarAIU').addEventListener('click', guardarAIU);
  document.getElementById('limpiarAIU').addEventListener('click', () => {
    document.getElementById('porcAdmin').value = 8;
    document.getElementById('porcImprevistos').value = 3;
    document.getElementById('porcUtilidad').value = 5;
    document.getElementById('detalleAdmin').value = '';
    actualizarAIU();
  });
});

function cargarAIU() {
  const datos = cargar('aiu');
  if (datos) {
    document.getElementById('porcAdmin').value = datos.administracion || 8;
    document.getElementById('porcImprevistos').value = datos.imprevistos || 3;
    document.getElementById('porcUtilidad').value = datos.utilidad || 5;
    document.getElementById('detalleAdmin').value = datos.detalleAdministracion || '';
  }
  actualizarAIU();
}

function actualizarAIU() {
  const totalCostosDirectos = obtenerTotalCostosDirectos();
  const adminPct = parseFloat(document.getElementById('porcAdmin').value) || 0;
  const impPct = parseFloat(document.getElementById('porcImprevistos').value) || 0;
  const utilPct = parseFloat(document.getElementById('porcUtilidad').value) || 0;

  const adminVal = totalCostosDirectos * (adminPct / 100);
  const impVal = totalCostosDirectos * (impPct / 100);
  const utilVal = totalCostosDirectos * (utilPct / 100);
  const totalAIU = adminVal + impVal + utilVal;
  const costoTotal = totalCostosDirectos + totalAIU;

  document.getElementById('valorAdmin').textContent = '$' + Math.round(adminVal).toLocaleString('es-CO');
  document.getElementById('valorImprevistos').textContent = '$' + Math.round(impVal).toLocaleString('es-CO');
  document.getElementById('valorUtilidad').textContent = '$' + Math.round(utilVal).toLocaleString('es-CO');

  document.getElementById('resumenCostosDirectos').textContent = '$' + Math.round(totalCostosDirectos).toLocaleString('es-CO');
  document.getElementById('resumenTotalAIU').textContent = '$' + Math.round(totalAIU).toLocaleString('es-CO');
  document.getElementById('resumenCostoTotal').textContent = '$' + Math.round(costoTotal).toLocaleString('es-CO');
  document.getElementById('resumenPorcentajeAIU').textContent = 
    totalCostosDirectos > 0 ? ((totalAIU / totalCostosDirectos) * 100).toFixed(1) + '%' : '0%';
  document.getElementById('costoTotalProyecto').textContent = '$' + Math.round(costoTotal).toLocaleString('es-CO');
}

function guardarAIU() {
  const datos = {
    administracion: parseFloat(document.getElementById('porcAdmin').value) || 8,
    imprevistos: parseFloat(document.getElementById('porcImprevistos').value) || 3,
    utilidad: parseFloat(document.getElementById('porcUtilidad').value) || 5,
    detalleAdministracion: document.getElementById('detalleAdmin').value.trim()
  };
  guardar('aiu', datos);
  alert('✅ Configuración AIU guardada');
}