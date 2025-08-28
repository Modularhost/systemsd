
// Mostrar la fecha actual
const dateElement = document.getElementById('currentDate');
const today = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
dateElement.textContent = today.toLocaleDateString('es-ES', options);

// Datos de los submenús
const submenus = {
  implantes: [
    { text: 'Ingresos', page: 'ingresos' },
    { text: 'Cargar', page: 'cargar' },
    { text: 'Pacientes', page: 'pacientes' },
    { text: 'Referencias', page: 'referencias' }
  ],
  consignacion: [
    { text: 'Registro', page: 'registro' },
    { text: 'Seguimiento', page: 'seguimiento' },
    { text: 'Reportes', page: 'reportes' }
  ],
  historico: [
    { text: 'Consultas', page: 'consultas' },
    { text: 'Archivos', page: 'archivos' }
  ],
  laboratorio: [
    { text: 'Análisis', page: 'analisis' },
    { text: 'Resultados', page: 'resultados' }
  ],
  visualizador: [
    { text: 'Gráficos', page: 'graficos' },
    { text: 'Imágenes', page: 'imagenes' }
  ],
  prestacion: [
    { text: 'Servicios', page: 'servicios' },
    { text: 'Facturación', page: 'facturacion' }
  ],
  herramientas: [
    { text: 'Utilidades', page: 'utilidades' },
    { text: 'Configuración', page: 'configuracion-herramientas' }
  ],
  importacion: [
    { text: 'Carga Masiva', page: 'carga-masiva' },
    { text: 'Validación', page: 'validacion' }
  ],
  apuntes: [
    { text: 'Notas', page: 'notas' },
    { text: 'Recordatorios', page: 'recordatorios' }
  ],
  migracion: [
    { text: 'Transferencia', page: 'transferencia' },
    { text: 'Sincronización', page: 'sincronizacion' }
  ],
  dashboard: [
    { text: 'Resumen', page: 'resumen' },
    { text: 'Estadísticas', page: 'estadisticas' }
  ],
  archivos: [
    { text: 'Subir', page: 'subir' },
    { text: 'Gestionar', page: 'gestionar' }
  ],
  usuarios: [
    { text: 'Crear', page: 'crear-usuario' },
    { text: 'Editar', page: 'editar-usuario' }
  ],
  configuracion: [
    { text: 'Sistema', page: 'sistema' },
    { text: 'Preferencias', page: 'preferencias' }
  ],
  'cerrar-sesion': [
    { text: 'Confirmar', page: 'confirmar-cerrar-sesion' }
  ]
};

// Elementos del DOM
const mainMenu = document.querySelector('.main-menu');
const submenu = document.querySelector('.submenu');
const submenuContent = document.querySelector('.submenu-content');
const backLink = document.querySelector('.back-link');
const content = document.querySelector('.content');

// Función para cargar contenido dinámico
function loadSubpage(page) {
  // Limpiar el contenido anterior
  content.innerHTML = '';
  
  // Remover estilos y scripts anteriores
  document.querySelectorAll('link[data-subpage], script[data-subpage]').forEach(el => el.remove());

  // Cargar HTML
  fetch(`../subpages/${page}.html`)
    .then(response => response.text())
    .then(data => {
      content.innerHTML = data;

      // Cargar CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `../subpages/${page}.css`;
      link.dataset.subpage = page;
      document.head.appendChild(link);

      // Cargar JS
      const script = document.createElement('script');
      script.src = `../subpages/${page}.js`;
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
      `<a href="#" data-page="${item.page}">${item.text}</a>`
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
    const page = e.target.getAttribute('data-page');
    if (page) {
      loadSubpage(page);
    }
  }
});
