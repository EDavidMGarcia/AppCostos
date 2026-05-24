function guardar(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}
function cargar(clave) {
  const datos = localStorage.getItem(clave);
  return datos ? JSON.parse(datos) : null;
}