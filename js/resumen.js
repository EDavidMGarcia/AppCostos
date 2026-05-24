// ========== MÓDULO RESUMEN, GRÁFICAS Y CRONOGRAMA ==========
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('actualizarResumen').addEventListener('click', actualizarTodo);
  document.getElementById('generarCronograma').addEventListener('click', generarCronograma);
  actualizarTodo();
});

function actualizarTodo() {
  actualizarTarjetas();
  actualizarGraficos();
}

function actualizarTarjetas() {
  const totalDirectos = obtenerTotalCostosDirectos();
  const aiu = cargar('aiu');
  const estudios = cargar('anteproyecto') || [];
  const computos = cargar('computos') || [];
  
  const totalEstudios = estudios.filter(e => e.incluido !== false).reduce((s, e) => s + (e.valor || 0), 0);
  const totalComputos = computos.reduce((s, c) => {
    const cantidad = c.cantidad || 0;
    const precio = c.precioUnitario || 0;
    const desperdicio = c.desperdicio || 0;
    return s + (cantidad * precio * (1 + desperdicio / 100));
  }, 0);

  let totalAIU = 0;
  if (aiu) {
    totalAIU = totalDirectos * ((aiu.administracion || 0) + (aiu.imprevistos || 0) + (aiu.utilidad || 0)) / 100;
  }
  const costoTotal = totalDirectos + totalAIU + totalEstudios + totalComputos;

  document.getElementById('resumenDirectos').textContent = '$' + Math.round(totalDirectos).toLocaleString('es-CO');
  document.getElementById('resumenAIU').textContent = '$' + Math.round(totalAIU).toLocaleString('es-CO');
  document.getElementById('resumenEstudios').textContent = '$' + Math.round(totalEstudios).toLocaleString('es-CO');
  document.getElementById('resumenTotal').textContent = '$' + Math.round(costoTotal).toLocaleString('es-CO');
  document.getElementById('cantEstudios').textContent = estudios.filter(e => e.incluido !== false).length + ' estudios';
}

function actualizarGraficos() {
  const capitulos = cargar('capitulos') || [];
  const labels = capitulos.map(c => c.nombre);
  const valores = capitulos.map(c => c.valor);
  
  // Gráfico de capítulos (doughnut)
  const ctx1 = document.getElementById('graficoCapítulos')?.getContext('2d');
  if (ctx1) {
    if (window.graficoCap) window.graficoCap.destroy();
    window.graficoCap = new Chart(ctx1, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: valores,
          backgroundColor: [
            '#1a6d5e', '#2a8f7b', '#e6b422', '#f0cc5e',
            '#4a9e8e', '#6bbaa7', '#89c9b8', '#a8d8c9'
          ]
        }]
      }
    });
  }

  // Gráfico de resumen (barras)
  const aiu = cargar('aiu');
  const totalDirectos = obtenerTotalCostosDirectos();
  const estudios = cargar('anteproyecto') || [];
  const totalEstudios = estudios.filter(e => e.incluido !== false).reduce((s, e) => s + (e.valor || 0), 0);
  let totalAIU = 0;
  if (aiu) totalAIU = totalDirectos * ((aiu.administracion || 0) + (aiu.imprevistos || 0) + (aiu.utilidad || 0)) / 100;

  const ctx2 = document.getElementById('graficoResumen')?.getContext('2d');
  if (ctx2) {
    if (window.graficoRes) window.graficoRes.destroy();
    window.graficoRes = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: ['Costos Directos', 'AIU', 'Estudios Previos'],
        datasets: [{
          data: [totalDirectos, totalAIU, totalEstudios],
          backgroundColor: ['#1a6d5e', '#e6b422', '#64748b']
        }]
      }
    });
  }
}

function generarCronograma() {
  const capitulos = cargar('capitulos') || [];
  const fechaInicio = document.getElementById('fechaInicioCronograma').value;
  const duracion = parseInt(document.getElementById('duracionMeses').value) || 12;

  if (!fechaInicio || capitulos.length === 0) {
    alert('Complete la fecha de inicio y los capítulos');
    return;
  }

  const inicio = new Date(fechaInicio + 'T00:00:00');
  const container = document.getElementById('ganttContainer');
  container.innerHTML = '<div style="overflow-x:auto; min-width:600px"><table style="width:100%"><thead><tr><th>Capítulo</th></tr></thead><tbody id="ganttBody"></tbody></table></div>';
  
  // Distribución proporcional simplificada
  let html = '';
  let mesActual = 0;
  const totalCosto = capitulos.reduce((s, c) => s + c.valor, 0) || 1;

  capitulos.forEach(cap => {
    const peso = cap.valor / totalCosto;
    const meses = Math.max(1, Math.round(duracion * peso));
    const fin = new Date(inicio);
    fin.setMonth(fin.getMonth() + mesActual + meses);
    const inicioFase = new Date(inicio);
    inicioFase.setMonth(inicioFase.getMonth() + mesActual);
    
    html += `<tr>
      <td>${cap.nombre}</td>
      <td style="font-size:0.8rem">${inicioFase.toLocaleDateString('es')} - ${fin.toLocaleDateString('es')} (${meses} meses)</td>
    </tr>`;
    mesActual += meses;
  });
  
  document.getElementById('ganttBody').innerHTML = html;

  // Curva S
  const curvaS = [];
  let acumulado = 0;
  const mesesTotal = [];
  for (let i = 1; i <= duracion; i++) mesesTotal.push('Mes ' + i);
  
  // Cálculo simplificado de avance acumulado
  for (let i = 0; i < duracion; i++) {
    acumulado = ((i + 1) / duracion) * 100;
    curvaS.push(parseFloat(acumulado.toFixed(1)));
  }

  const ctx3 = document.getElementById('graficoCurvaS')?.getContext('2d');
  if (ctx3) {
    if (window.graficoCurva) window.graficoCurva.destroy();
    window.graficoCurva = new Chart(ctx3, {
      type: 'line',
      data: {
        labels: mesesTotal,
        datasets: [{
          label: 'Avance %',
          data: curvaS,
          borderColor: '#e6b422',
          backgroundColor: 'rgba(230,180,34,0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.3
        }]
      }
    });
  }
}