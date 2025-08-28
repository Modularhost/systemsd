// Script global para permisos en menu.js (agregar al final de menu.js o como archivo separado)
// Simular usuario logueado
const usuarioActual = { rol: 'operador', permisos: ['implantes-cargar', 'laboratorio-analisis'] }; // Ejemplo para operador

// Filtrar menús basados en rol y permisos
document.addEventListener('DOMContentLoaded', () => {
  if (usuarioActual.rol !== 'administrador') {
    // Ocultar menús no permitidos
    document.querySelectorAll('.main-menu a').forEach(link => {
      const submenuId = link.getAttribute('data-submenu');
      if (!usuarioActual.permisos.some(p => p.startsWith(submenuId))) {
        link.style.display = 'none';
      }
    });
  }
});

// En loadSubpage, filtrar submenús
const originalSubmenus = {...submenus}; // Copia original
Object.keys(submenus).forEach(key => {
  submenus[key] = submenus[key].filter(item => usuarioActual.rol === 'administrador' || usuarioActual.permisos.includes(`${key}-${item.page}`));
});