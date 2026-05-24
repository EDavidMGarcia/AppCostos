// ========== MÓDULO ANTEPROYECTO – ESTUDIOS PREVIOS ==========
document.addEventListener('DOMContentLoaded', () => {
  cargarEstudios();
  document.getElementById('agregarEstudio').addEventListener('click', () => agregarEstudio());
  document.getElementById('guardarEstudios').addEventListener('click', guardarEstudios);
  document.getElementById('restablecerEstudios').addEventListener('click', () => {
    localStorage.removeItem('anteproyecto');
    cargarEstudios();
  });
});

function cargarEstudios() {
  let estudios = cargar('anteproyecto');
  const contenedor = document.getElementById('listaEstudios');
  contenedor.innerHTML = '';

  if (!estudios || estudios.length === 0) {
    // Por defecto
    estudios = [
      { nombre: 'Estudio de Topografía', valor: 0, incluido: true },
      { nombre: 'Estudio de Suelos', valor: 0, incluido: true },
      { nombre: 'Diseño Arquitectónico', valor: 0, incluido: true },
      { nombre: 'Diseño Estructural', valor: 0, incluido: true },
      { nombre: 'Licencia de Construcción', valor: 0, incluido: true }
    ];
  }

  estudios.forEach((est, index) => {
    agregarFilaEstudio(est, index);
  });
  actualizarTotalEstudios();
}

function agregarFilaEstudio(est = { nombre: '', valor: 0, incluido: true }, index) {
  const contenedor = document.getElementById('listaEstudios');
  const div = document.createElement('div');
  div.className = 'fila-estudio';
  div.style.cssText = 'display:grid; grid-template-columns:1fr 150px auto auto; gap:1rem; align-items:center; margin-bottom:0.75rem; padding:0.75rem; background:rgba(255,255,255,0.4); border-radius:12px';
  div.innerHTML = `
    <input type="text" class="nombreEstudio" value="${est.nombre}" placeholder="Nombre del estudio">
    <input type="number" class="valorEstudio" value="${est.valor}" min="0" step="100000" placeholder="Valor $">
    <label style="display:flex; align-items:center; gap:0.25rem; font-size:0.85rem; white-space:nowrap">
      <input type="checkbox" class="incluidoEstudio" ${est.incluido !== false ? 'checked' : ''}> Incluir
    </label>
    <button type="button" class="btn-ghost eliminarEstudio" style="color:red">✕</button>
  `;
  contenedor.appendChild(div);

  div.querySelector('.nombreEstudio').addEventListener('input', actualizarTotalEstudios);
  div.querySelector('.valorEstudio').addEventListener('input', actualizarTotalEstudios);
  div.querySelector('.incluidoEstudio').addEventListener('change', actualizarTotalEstudios);
  div.querySelector('.eliminarEstudio').addEventListener('click', () => {
    div.remove();
    actualizarTotalEstudios();
  });
}

function agregarEstudio() {
  agregarFilaEstudio();
  actualizarTotalEstudios();
}

function actualizarTotalEstudios() {
  let total = 0;
  let incluidos = 0;
  document.querySelectorAll('.fila-estudio').forEach(fila => {
    const nombre = fila.querySelector('.nombreEstudio').value;
    const valor = parseFloat(fila.querySelector('.valorEstudio').value) || 0;
    const incluido = fila.querySelector('.incluidoEstudio').checked;
    if (incluido && nombre.trim()) {
      total += valor;
      incluidos++;
    }
  });
  document.getElementById('totalEstudiosPrevios').textContent = '$' + Math.round(total).toLocaleString('es-CO');
  document.getElementById('cantEstudiosIncluidos').textContent = incluidos + ' estudios incluidos';
}

function guardarEstudios() {
  const estudios = [];
  document.querySelectorAll('.fila-estudio').forEach(fila => {
    estudios.push({
      nombre: fila.querySelector('.nombreEstudio').value.trim(),
      valor: parseFloat(fila.querySelector('.valorEstudio').value) || 0,
      incluido: fila.querySelector('.incluidoEstudio').checked
    });
  });
  guardar('anteproyecto', estudios);
  alert('✅ Estudios previos guardados');
}