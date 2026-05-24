// ========== MÓDULO CAPÍTULOS – COSTOS DIRECTOS ==========
document.addEventListener('DOMContentLoaded', () => {
  cargarCapitulos();
  document.getElementById('agregarCapitulo').addEventListener('click', () => agregarFilaCapitulo());
  document.getElementById('guardarCapitulos').addEventListener('click', guardarCapitulos);
  document.getElementById('limpiarCapitulos').addEventListener('click', () => {
    document.getElementById('bodyCapitulos').innerHTML = '';
    actualizarTotalesCapitulos();
  });
});

function cargarCapitulos() {
  const capitulos = cargar('capitulos') || [];
  const tbody = document.getElementById('bodyCapitulos');
  tbody.innerHTML = '';
  if (capitulos.length === 0) {
    // Capítulos sugeridos por defecto
    const porDefecto = [
      'Preliminares', 'Cimentación', 'Estructura', 'Mampostería',
      'Instalaciones Hidrosanitarias', 'Instalaciones Eléctricas',
      'Acabados', 'Carpintería', 'Cubierta'
    ];
    porDefecto.forEach(nombre => agregarFilaCapitulo({ nombre, valor: 0 }));
  } else {
    capitulos.forEach(cap => agregarFilaCapitulo(cap));
  }
  actualizarTotalesCapitulos();
}

function agregarFilaCapitulo(datos = {}) {
  const tbody = document.getElementById('bodyCapitulos');
  const tr = document.createElement('tr');
  tr.className = 'fila-capitulo';
  tr.innerHTML = `
    <td><input type="text" class="nombreCapitulo" value="${datos.nombre || ''}" placeholder="Nombre del capítulo"></td>
    <td><input type="number" class="valorCapitulo" value="${datos.valor || 0}" min="0" step="100000" style="width:150px"></td>
    <td class="porcentajeCapitulo">0%</td>
    <td>
      <button type="button" class="btn-ghost eliminarFilaCapitulo" style="color:red">✕</button>
    </td>
  `;
  tbody.appendChild(tr);

  const inputValor = tr.querySelector('.valorCapitulo');
  inputValor.addEventListener('input', actualizarTotalesCapitulos);
  tr.querySelector('.eliminarFilaCapitulo').addEventListener('click', () => {
    tr.remove();
    actualizarTotalesCapitulos();
  });
}

function actualizarTotalesCapitulos() {
  const filas = document.querySelectorAll('.fila-capitulo');
  let total = 0;
  const valores = [];

  filas.forEach(tr => {
    const valor = parseFloat(tr.querySelector('.valorCapitulo').value) || 0;
    valores.push(valor);
    total += valor;
  });

  document.getElementById('totalCapitulos').textContent = '$' + Math.round(total).toLocaleString('es-CO');

  filas.forEach((tr, i) => {
    const porcentaje = total > 0 ? (valores[i] / total) * 100 : 0;
    tr.querySelector('.porcentajeCapitulo').textContent = porcentaje.toFixed(1) + '%';
  });

  // Actualizar costo por m² en carátula si la función existe
  if (typeof actualizarCostoPorM2 === 'function') {
    actualizarCostoPorM2();
  }
}

function guardarCapitulos() {
  const capitulos = [];
  document.querySelectorAll('.fila-capitulo').forEach(tr => {
    const nombre = tr.querySelector('.nombreCapitulo').value.trim();
    const valor = parseFloat(tr.querySelector('.valorCapitulo').value) || 0;
    if (nombre) capitulos.push({ nombre, valor });
  });
  guardar('capitulos', capitulos);
  alert('✅ Capítulos guardados correctamente');
}