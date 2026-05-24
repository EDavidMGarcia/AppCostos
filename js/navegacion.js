// ========== NAVEGACIÓN ==========
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav');
  const tabs = [
    { id: 'guia', icon: '📘', label: 'Guía' },
    { id: 'caratula', icon: '🏗️', label: 'Carátula' },
    { id: 'anteproyecto', icon: '🔍', label: 'Anteproyecto' },
    { id: 'computos', icon: '🧮', label: 'Cómputos' },
    { id: 'capitulos', icon: '📋', label: 'Capítulos' },
    { id: 'aiu', icon: '⚙️', label: 'AIU' },
    { id: 'resumen', icon: '📊', label: 'Resumen' },
    { id: 'informe', icon: '📑', label: 'Informe' }
  ];

  tabs.forEach(tab => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn';
    btn.dataset.tab = tab.id;
    btn.innerHTML = `<span>${tab.icon} ${tab.label}</span>`;
    btn.addEventListener('click', () => activarTab(tab.id));
    nav.appendChild(btn);
  });

  activarTab('guia');

  // ---- TOGGLE MENÚ MÓVIL ----
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    // Cerrar menú al seleccionar una pestaña en móvil
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          sidebar.classList.remove('open');
        }
      });
    });
  }
});

function activarTab(id) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  const btn = document.querySelector(`.tab-btn[data-tab="${id}"]`);
  const content = document.getElementById(id);
  if (btn) btn.classList.add('active');
  if (content) content.classList.add('active');
}