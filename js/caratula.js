// ========== MÓDULO CARÁTULA ==========
document.addEventListener('DOMContentLoaded', () => {
  cargarCaratula();
  actualizarCostoPorM2();

  document.getElementById('formCaratula').addEventListener('submit', (e) => {
    e.preventDefault();
    guardarCaratula();
  });

  document.getElementById('limpiarCaratula').addEventListener('click', () => {
    localStorage.removeItem('caratula');
    document.getElementById('formCaratula').reset();
    document.getElementById('costoPorM2').textContent = '$0';
    alert('Carátula limpiada');
  });

  document.getElementById('areaConstruida').addEventListener('input', actualizarCostoPorM2);
});

function cargarCaratula() {
  const datos = cargar('caratula');
  if (!datos) return;

  document.getElementById('nombreProyecto').value = datos.nombre || '';
  document.getElementById('ubicacion').value = datos.ubicacion || '';
  document.getElementById('propietario').value = datos.propietario || '';
  document.getElementById('constructor').value = datos.constructor || '';
  document.getElementById('fechaProyecto').value = datos.fecha || '';
  document.getElementById('areaConstruida').value = datos.areaConstruida || '';

  const normativas = datos.normativa ? datos.normativa.split(' · ') : [];
  document.querySelectorAll('.normativa').forEach(cb => {
    cb.checked = normativas.includes(cb.value);
  });
}

function guardarCaratula() {
  const normativas = [];
  document.querySelectorAll('.normativa:checked').forEach(cb => normativas.push(cb.value));

  const datos = {
    nombre: document.getElementById('nombreProyecto').value.trim(),
    ubicacion: document.getElementById('ubicacion').value.trim(),
    propietario: document.getElementById('propietario').value.trim(),
    constructor: document.getElementById('constructor').value.trim(),
    fecha: document.getElementById('fechaProyecto').value,
    areaConstruida: parseFloat(document.getElementById('areaConstruida').value) || 0,
    normativa: normativas.join(' · ')
  };

  guardar('caratula', datos);
  actualizarCostoPorM2();
  alert('✅ Carátula guardada correctamente');
}

function actualizarCostoPorM2() {
  const area = parseFloat(document.getElementById('areaConstruida').value) || 0;
  const totalCostosDirectos = obtenerTotalCostosDirectos();
  const costoPorM2 = area > 0 ? totalCostosDirectos / area : 0;
  document.getElementById('costoPorM2').textContent = 
    '$' + costoPorM2.toLocaleString('es-CO');
}

function obtenerTotalCostosDirectos() {
  const capitulos = cargar('capitulos');
  if (!capitulos || !capitulos.length) return 0;
  return capitulos.reduce((sum, c) => sum + (c.valor || 0), 0);
}