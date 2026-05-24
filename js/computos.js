// ========== MÓDULO CÓMPUTOS MÉTRICOS ==========
document.addEventListener('DOMContentLoaded', () => {
  cargarComputos();
  document.getElementById('agregarItemComputo').addEventListener('click', agregarItem);
  document.getElementById('guardarComputos').addEventListener('click', guardarComputos);
  document.getElementById('limpiarComputos').addEventListener('click', () => {
    document.getElementById('bodyComputos').innerHTML = '';
    actualizarTotalesComputos();
  });
});

function cargarComputos() {
  const items = cargar('computos') || [];
  const tbody = document.getElementById('bodyComputos');
  tbody.innerHTML = '';
  items.forEach(item => agregarFila(item));
  actualizarTotalesComputos();
}

function agregarFila(datos = {}) {
  const tbody = document.getElementById('bodyComputos');
  const tr = document.createElement('tr');
  tr.className = 'fila-computo';
  tr.innerHTML = `
    <td><input type="text" class="descComputo" value="${datos.descripcion || ''}" placeholder="Material o actividad"></td>
    <td><input type="text" class="unidadComputo" value="${datos.unidad || ''}" placeholder="m³, kg, und" style="width:80px"></td>
    <td><input type="number" class="cantidadComputo" value="${datos.cantidad || 1}" min="0" step="0.01" style="width:100px"></td>
    <td><input type="number" class="precioComputo" value="${datos.precioUnitario || 0}" min="0" step="1000" style="width:120px"></td>
    <td><input type="number" class="desperdicioComputo" value="${datos.desperdicio || 5}" min="0" max="100" step="0.1" style="width:70px"></td>
    <td class="totalFilaComputo" style="font-weight:bold;color:var(--primary)">$0</td>
    <td>
      <button type="button" class="btn-ghost consultarPrecio" title="Consultar precio de referencia">🔍</button>
      <button type="button" class="btn-ghost eliminarFilaComputo" style="color:red">✕</button>
    </td>
  `;
  tbody.appendChild(tr);

  // Eventos
  const inputs = tr.querySelectorAll('input');
  inputs.forEach(input => input.addEventListener('input', () => {
    actualizarTotalFila(tr);
    actualizarTotalesComputos();
  }));
  tr.querySelector('.eliminarFilaComputo').addEventListener('click', () => {
    tr.remove();
    actualizarTotalesComputos();
  });
  tr.querySelector('.consultarPrecio').addEventListener('click', () => consultarPrecio(tr));
  actualizarTotalFila(tr);
}

function actualizarTotalFila(tr) {
  const cantidad = parseFloat(tr.querySelector('.cantidadComputo').value) || 0;
  const precio = parseFloat(tr.querySelector('.precioComputo').value) || 0;
  const desperdicio = parseFloat(tr.querySelector('.desperdicioComputo').value) || 0;
  const total = cantidad * precio * (1 + desperdicio / 100);
  tr.querySelector('.totalFilaComputo').textContent = '$' + Math.round(total).toLocaleString('es-CO');
}

function actualizarTotalesComputos() {
  let total = 0;
  document.querySelectorAll('.fila-computo').forEach(tr => {
    const cantidad = parseFloat(tr.querySelector('.cantidadComputo').value) || 0;
    const precio = parseFloat(tr.querySelector('.precioComputo').value) || 0;
    const desperdicio = parseFloat(tr.querySelector('.desperdicioComputo').value) || 0;
    total += cantidad * precio * (1 + desperdicio / 100);
  });
  document.getElementById('totalComputos').textContent = '$' + Math.round(total).toLocaleString('es-CO');
  const cant = document.querySelectorAll('.fila-computo').length;
  document.getElementById('cantItemsComputos').textContent = cant + ' ítems';
}

function consultarPrecio(tr) {
  const desc = tr.querySelector('.descComputo').value.trim().toLowerCase();
  const preciosRef = {
    'concreto 3000 psi': 450000,
    'acero de refuerzo 1/2"': 12000,
    'ladrillo estructural': 800,
    'mortero de pega': 350,
    'pintura vinilo': 25000,
    'cerámica 30x30': 32000,
    'arena lavada': 120000,
    'tubería pvc 4"': 18000,
    'cemento gris': 28000
  };
  const precio = preciosRef[desc];
  if (precio) {
    tr.querySelector('.precioComputo').value = precio;
    actualizarTotalFila(tr);
    actualizarTotalesComputos();
    alert('Precio de referencia: $' + precio.toLocaleString('es-CO'));
  } else {
    alert('No hay precio de referencia para este ítem. Ingrese manualmente.');
  }
}

function agregarItem() {
  agregarFila();
}

function guardarComputos() {
  const items = [];
  document.querySelectorAll('.fila-computo').forEach(tr => {
    items.push({
      descripcion: tr.querySelector('.descComputo').value.trim(),
      unidad: tr.querySelector('.unidadComputo').value.trim(),
      cantidad: parseFloat(tr.querySelector('.cantidadComputo').value) || 0,
      precioUnitario: parseFloat(tr.querySelector('.precioComputo').value) || 0,
      desperdicio: parseFloat(tr.querySelector('.desperdicioComputo').value) || 0
    });
  });
  guardar('computos', items);
  alert('✅ Cómputos métricos guardados');
}