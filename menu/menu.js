// Mostrar la fecha actual
const dateElement = document.getElementById('currentDate');
const today = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
dateElement.textContent = today.toLocaleDateString('es-ES', options);

// Datos de los submenús
const submenus = {
  implantes: [
    { text: 'Ingresos', page: 'ingresos', folder: 'implantes' },
    { text: 'Cargar', page: 'cargar', folder: 'implantes' },
    { text: 'Pacientes', page: 'pacientes', folder: 'implantes' },
    { text: 'Referencias', page: 'referencias', folder: 'implantes' }
  ],
  consignacion: [
    { text: 'Registro', page: 'registro', folder: 'consignacion' },
    { text: 'Seguimiento', page: 'seguimiento', folder: 'consignacion' },
    { text: 'Reportes', page: 'reportes', folder: 'consignacion' }
  ],
  historico: [
    { text: 'Consultas', page: 'consultas', folder: 'historico' },
    { text: 'Archivos', page: 'archivos', folder: 'historico' }
  ],
  laboratorio: [
    { text: 'Análisis', page: 'analisis', folder: 'laboratorio' },
    { text: 'Resultados', page: 'resultados', folder: 'laboratorio' }
  ],
  visualizador: [
    { text: 'Gráficos', page: 'graficos', folder: 'visualizador' },
    { text: 'Imágenes', page: 'imagenes', folder: 'visualizador' }
  ],
  prestacion: [
    { text: 'Servicios', page: 'servicios', folder: 'prestacion' },
    { text: 'Facturación', page: 'facturacion', folder: 'prestacion' }
  ],
  herramientas: [
    { text: 'Utilidades', page: 'utilidades', folder: 'herramientas' },
    { text: 'Configuración', page: 'configuracion-herramientas', folder: 'herramientas' }
  ],
  importacion: [
    { text: 'Carga Masiva', page: 'carga-masiva', folder: 'importacion' },
    { text: 'Validación', page: 'validacion', folder: 'importacion' }
  ],
  apuntes: [
    { text: 'Notas', page: 'notas', folder: 'apuntes' },
    { text: 'Recordatorios', page: 'recordatorios', folder: 'apuntes' }
  ],
  migracion: [
    { text: 'Transferencia', page: 'transferencia', folder: 'migracion' },
    { text: 'Sincronización', page: 'sincronizacion', folder: 'migracion' }
  ],
  dashboard: [
    { text: 'Resumen', page: 'resumen', folder: 'dashboard' },
    { text: 'Estadísticas', page: 'estadisticas', folder: 'dashboard' }
  ],
  archivos: [
    { text: 'Subir', page: 'subir', folder: 'archivos' },
    { text: 'Gestionar', page: 'gestionar', folder: 'archivos' }
  ],
  usuarios: [
    { text: 'Crear', page: 'crear-usuario', folder: 'usuarios' },
    { text: 'Editar', page: 'editar-usuario', folder: 'usuarios' }
  ],
  configuracion: [
    { text: 'Sistema', page: 'sistema', folder: 'configuracion' },
    { text: 'Preferencias', page: 'preferencias', folder: 'configuracion' }
  ],
  'cerrar-sesion': [
    { text: 'Confirmar', page: 'confirmar-cerrar-sesion', folder: 'cerrar-sesion' }
  ]
};

// Elementos del DOM
const mainMenu = document.querySelector('.main-menu');
const submenu = document.querySelector('.submenu');
const submenuContent = document.querySelector('.submenu-content');
const backLink = document.querySelector('.back-link');
const content = document.querySelector('.content');

// Función para cargar contenido dinámico
function loadSubpage(folder, page) {
  // Limpiar el contenido anterior
  content.innerHTML = '';
  
  // Remover estilos y scripts anteriores
  document.querySelectorAll('link[data-subpage], script[data-subpage]').forEach(el => el.remove());

  // Cargar HTML
  fetch(`../subpages/${folder}/${page}/${page}.html`)
    .then(response => response.text())
    .then(data => {
      content.innerHTML = data;

      // Cargar CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `../subpages/${folder}/${page}/${page}.css`;
      link.dataset.subpage = page;
      document.head.appendChild(link);

      // Cargar JS
      const script = document.createElement('script');
      script.src = `../subpages/${folder}/${page}/${page}.js`;
      script.dataset.subpage = page;
      document.body.appendChild(script);
    })
    .catch(error => {
      content.innerHTML = '<p>Error al cargar la página</p>';
      console.error('Error al cargar subpágina:', error);
    });
}

// Mostrar submenú al hacer clic en un enlace del menú principal
document.querySelectorAll('.main-menu a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const submenuId = link.getAttribute('data-submenu');
    const submenuItems = submenus[submenuId] || [];

    // Poblar el contenido del submenú
    submenuContent.innerHTML = submenuItems.map(item => 
      `<a href="#" data-folder="${item.folder}" data-page="${item.page}">${item.text}</a>`
    ).join('');

    // Ocultar menú principal y mostrar submenú
    mainMenu.style.display = 'none';
    submenu.style.display = 'block';
  });
});

// Volver al menú principal
backLink.addEventListener('click', (e) => {
  e.preventDefault();
  submenu.style.display = 'none';
  mainMenu.style.display = 'block';
});

// Cargar subpágina al hacer clic en un enlace del submenú
submenuContent.addEventListener('click', (e) => {
  e.preventDefault();
  if (e.target.tagName === 'A') {
    const folder = e.target.getAttribute('data-folder');
    const page = e.target.getAttribute('data-page');
    if (folder && page) {
      loadSubpage(folder, page);
    }
  }
});