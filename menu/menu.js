const dateElement = document.getElementById('currentDate');
const today = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
dateElement.textContent = today.toLocaleDateString('es-ES', options);

// Submenu data
const submenus = {
  implantes: [
    { text: 'Ingresos', href: '#' },
    { text: 'Cargar', href: '#' },
    { text: 'Pacientes', href: '#' },
    { text: 'Referencias', href: '#' }
  ],
  consignacion: [
    { text: 'Registro', href: '#' },
    { text: 'Seguimiento', href: '#' },
    { text: 'Reportes', href: '#' }
  ],
  historico: [
    { text: 'Consultas', href: '#' },
    { text: 'Archivos', href: '#' }
  ],
  laboratorio: [
    { text: 'Análisis', href: '#' },
    { text: 'Resultados', href: '#' }
  ],
  visualizador: [
    { text: 'Gráficos', href: '#' },
    { text: 'Imágenes', href: '#' }
  ],
  prestacion: [
    { text: 'Servicios', href: '#' },
    { text: 'Facturación', href: '#' }
  ],
  herramientas: [
    { text: 'Utilidades', href: '#' },
    { text: 'Configuración', href: '#' }
  ],
  importacion: [
    { text: 'Carga Masiva', href: '#' },
    { text: 'Validación', href: '#' }
  ],
  apuntes: [
    { text: 'Notas', href: '#' },
    { text: 'Recordatorios', href: '#' }
  ],
  migracion: [
    { text: 'Transferencia', href: '#' },
    { text: 'Sincronización', href: '#' }
  ],
  dashboard: [
    { text: 'Resumen', href: '#' },
    { text: 'Estadísticas', href: '#' }
  ],
  archivos: [
    { text: 'Subir', href: '#' },
    { text: 'Gestionar', href: '#' }
  ],
  usuarios: [
    { text: 'Crear', href: '#' },
    { text: 'Editar', href: '#' }
  ],
  configuracion: [
    { text: 'Sistema', href: '#' },
    { text: 'Preferencias', href: '#' }
  ],
  'cerrar-sesion': [
    { text: 'Confirmar', href: '#' }
  ]
};

// DOM elements
const mainMenu = document.querySelector('.main-menu');
const submenu = document.querySelector('.submenu');
const submenuContent = document.querySelector('.submenu-content');
const backLink = document.querySelector('.back-link');

// Show submenu when a main menu link is clicked
document.querySelectorAll('.main-menu a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const submenuId = link.getAttribute('data-submenu');
    const submenuItems = submenus[submenuId] || [];

    // Populate submenu content
    submenuContent.innerHTML = submenuItems.map(item => `<a href="${item.href}">${item.text}</a>`).join('');

    // Hide main menu and show submenu
    mainMenu.style.display = 'none';
    submenu.style.display = 'block';
  });
});

// Return to main menu when back link is clicked
backLink.addEventListener('click', (e) => {
  e.preventDefault();
  submenu.style.display = 'none';
  mainMenu.style.display = 'block';
});