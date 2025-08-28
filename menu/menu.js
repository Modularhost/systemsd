// Mostrar la fecha actual
const dateElement = document.getElementById('currentDate');
const today = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
dateElement.textContent = today.toLocaleDateString('es-ES', options);

// Datos de los submenús
const submenus = {
  implantes: [
    { text: 'Ingresos', page: 'ingresos', folder: 'implantes', jsFiles: ['ingresos', 'formulas', 'lecturas'] },
    { text: 'Cargar', page: 'cargar', folder: 'implantes', jsFiles: ['cargar'] },
    { text: 'Pacientes', page: 'pacientes', folder: 'implantes', jsFiles: ['pacientes', 'datos', 'historial', 'notificaciones'] },
    { text: 'Referencias', page: 'referencias', folder: 'implantes', jsFiles: ['referencias'] }
  ],
  consignacion: [
    { text: 'Registro', page: 'registro', folder: 'consignacion', jsFiles: ['registro'] },
    { text: 'Seguimiento', page: 'seguimiento', folder: 'consignacion', jsFiles: ['seguimiento'] },
    { text: 'Reportes', page: 'reportes', folder: 'consignacion', jsFiles: ['reportes'] }
  ],
  historico: [
    { text: 'Consultas', page: 'consultas', folder: 'historico', jsFiles: ['consultas'] },
    { text: 'Archivos', page: 'archivos', folder: 'historico', jsFiles: ['archivos'] }
  ],
  laboratorio: [
    { text: 'Análisis', page: 'analisis', folder: 'laboratorio', jsFiles: ['analisis'] },
    { text: 'Resultados', page: 'resultados', folder: 'laboratorio', jsFiles: ['resultados'] }
  ],
  visualizador: [
    { text: 'Gráficos', page: 'graficos', folder: 'visualizador', jsFiles: ['graficos'] },
    { text: 'Imágenes', page: 'imagenes', folder: 'visualizador', jsFiles: ['imagenes'] }
  ],
  prestacion: [
    { text: 'Servicios', page: 'servicios', folder: 'prestacion', jsFiles: ['servicios'] },
    { text: 'Facturación', page: 'facturacion', folder: 'prestacion', jsFiles: ['facturacion'] }
  ],
  herramientas: [
    { text: 'Utilidades', page: 'utilidades', folder: 'herramientas', jsFiles: ['utilidades'] },
    { text: 'Configuración', page: 'configuracion-herramientas', folder: 'herramientas', jsFiles: ['configuracion-herramientas'] }
  ],
  importacion: [
    { text: 'Carga Masiva', page: 'carga-masiva', folder: 'importacion', jsFiles: ['carga-masiva'] },
    { text: 'Validación', page: 'validacion', folder: 'importacion', jsFiles: ['validacion'] }
  ],
  apuntes: [
    { text: 'Notas', page: 'notas', folder: 'apuntes', jsFiles: ['notas'] },
    { text: 'Recordatorios', page: 'recordatorios', folder: 'apuntes', jsFiles: ['recordatorios'] }
  ],
  migracion: [
    { text: 'Transferencia', page: 'transferencia', folder: 'migracion', jsFiles: ['transferencia'] },
    { text: 'Sincronización', page: 'sincronizacion', folder: 'migracion', jsFiles: ['sincronizacion'] }
  ],
  dashboard: [
    { text: 'Resumen', page: 'resumen', folder: 'dashboard', jsFiles: ['resumen'] },
    { text: 'Estadísticas', page: 'estadisticas', folder: 'dashboard', jsFiles: ['estadisticas'] }
  ],
  archivos: [
    { text: 'Subir', page: 'subir', folder: 'archivos', jsFiles: ['subir'] },
    { text: 'Gestionar', page: 'gestionar', folder: 'archivos', jsFiles: ['gestionar'] }
  ],
  usuarios: [
    { text: 'Crear', page: 'crear', folder: 'usuarios', jsFiles: ['crear'] },
    { text: 'Editar', page: 'editar', folder: 'usuarios', jsFiles: ['editar'] }
  ],
  configuracion: [
    { text: 'Sistema', page: 'sistema', folder: 'configuracion', jsFiles: ['sistema'] },
    { text: 'Preferencias', page: 'preferencias', folder: 'configuracion', jsFiles: ['preferencias'] }
  ],
  'cerrar-sesion': [
    { text: 'Confirmar', page: 'confirmar-cerrar-sesion', folder: 'cerrar-sesion', jsFiles: ['confirmar-cerrar-sesion'] }
  ]
};

// Elementos del DOM
const mainMenu = document.querySelector('.main-menu');
const submenu = document.querySelector('.submenu');
const submenuContent = document.querySelector('.submenu-content');
const backLink = document.querySelector('.back-link');
const content = document.querySelector('.content');

// Función para cargar contenido dinámico
function loadSubpage(folder, page, jsFiles) {
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

      // Cargar todos los archivos JS especificados
      jsFiles.forEach(jsFile => {
        const script = document.createElement('script');
        script.src = `../subpages/${folder}/${page}/${jsFile}.js`;
        script.dataset.subpage = page;
        document.body.appendChild(script);
      });
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
      `<a href="#" data-folder="${item.folder}" data-page="${item.page}" data-js-files="${item.jsFiles.join(',')}">${item.text}</a>`
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
    const jsFiles = e.target.getAttribute('data-js-files').split(',');
    if (folder && page && jsFiles) {
      loadSubpage(folder, page, jsFiles);
    }
  }
});