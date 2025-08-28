// subpages/usuarios/crear/crear.js

// Permisos por defecto según rol
const defaultPermissions = {
  administrador: {
    menus: {
      implantes: true,
      consignacion: true,
      historico: true,
      laboratorio: true,
      visualizador: true,
      prestacion: true,
      herramientas: true,
      importacion: true,
      apuntes: true,
      migracion: true,
      dashboard: true,
      archivos: true,
      usuarios: true,
      configuracion: true,
      'cerrar-sesion': true
    },
    submenus: {
      'implantes-ingresos': true,
      'implantes-cargar': true,
      'implantes-pacientes': true,
      'implantes-referencias': true,
      'laboratorio-analisis': true,
      'laboratorio-resultados': true,
      // Agrega todos los submenús para admin (todos true)
    },
    elements: {
      'implantes-cargar-formulario': true,
      'implantes-cargar-tabla': true,
      'implantes-cargar-registrar': true,
      'implantes-cargar-limpiar': true,
      'implantes-cargar-descargar': true,
      'implantes-cargar-importar': true,
      // Todos true para admin
    }
  },
  operador: {
    menus: {
      implantes: true,
      laboratorio: true,
      // Solo estos, el resto false
    },
    submenus: {
      'implantes-ingresos': false,
      'implantes-cargar': true,
      'implantes-pacientes': false,
      'implantes-referencias': false,
      'laboratorio-analisis': true,
      'laboratorio-resultados': false,
    },
    elements: {
      'implantes-cargar-formulario': true,
      'implantes-cargar-tabla': true,
      'implantes-cargar-registrar': true,
      'implantes-cargar-limpiar': true,
      'implantes-cargar-descargar': false, // Ejemplo: oculta descargar
      'implantes-cargar-importar': true,
    }
  },
  gestor: {
    // Similar a operador, pero personaliza según necesites. Por ahora, copio operador como placeholder
    menus: {
      implantes: true,
      laboratorio: true,
    },
    submenus: {
      'implantes-ingresos': false,
      'implantes-cargar': true,
      'implantes-pacientes': false,
      'implantes-referencias': false,
      'laboratorio-analisis': true,
      'laboratorio-resultados': false,
    },
    elements: {
      'implantes-cargar-formulario': true,
      'implantes-cargar-tabla': true,
      'implantes-cargar-registrar': true,
      'implantes-cargar-limpiar': true,
      'implantes-cargar-descargar': false,
      'implantes-cargar-importar': true,
    }
  }
};

// Función para cargar permisos por defecto según rol
function loadDefaultPermissions() {
  const role = document.getElementById('role').value;
  const perms = defaultPermissions[role] || { menus: {}, submenus: {}, elements: {} };

  // Marcar menús
  document.querySelectorAll('.menu-checkbox').forEach(checkbox => {
    const menu = checkbox.getAttribute('data-menu');
    checkbox.checked = perms.menus[menu] || false;
    toggleSubmenus(checkbox);
  });

  // Marcar submenús
  document.querySelectorAll('.submenu-checkbox').forEach(checkbox => {
    const submenu = checkbox.getAttribute('data-submenu');
    checkbox.checked = perms.submenus[submenu] || false;
    toggleElements(checkbox);
  });

  // Marcar elementos
  document.querySelectorAll('[data-element]').forEach(checkbox => {
    const element = checkbox.getAttribute('data-element');
    checkbox.checked = perms.elements[element] || false;
  });
}

// Función para toggle submenús
function toggleSubmenus(checkbox) {
  const subperms = checkbox.nextElementSibling;
  if (subperms && subperms.classList.contains('subpermissions')) {
    subperms.style.display = checkbox.checked ? 'block' : 'none';
    // Si se desmarca menú, desmarcar submenús y elementos
    if (!checkbox.checked) {
      subperms.querySelectorAll('input[type="checkbox"]').forEach(sub => sub.checked = false);
      subperms.querySelectorAll('.elements').forEach(el => el.style.display = 'none');
    }
  }
}

// Función para toggle elementos en submenús
function toggleElements(checkbox) {
  const elements = checkbox.nextElementSibling;
  if (elements && elements.classList.contains('elements')) {
    elements.style.display = checkbox.checked ? 'block' : 'none';
    // Si se desmarca submenú, desmarcar elementos
    if (!checkbox.checked) {
      elements.querySelectorAll('input[type="checkbox"]').forEach(el => el.checked = false);
    }
  }
}

// Manejar envío del formulario
document.getElementById('userForm').addEventListener('submit', (e) => {
  e.preventDefault();

  // Recopilar datos básicos
  const userData = {
    fullName: document.getElementById('fullName').value,
    username: document.getElementById('username').value,
    rut: document.getElementById('rut').value,
    dob: document.getElementById('dob').value,
    email: document.getElementById('email').value,
    sex: document.getElementById('sex').value,
    role: document.getElementById('role').value,
    permissions: {
      menus: {},
      submenus: {},
      elements: {}
    }
  };

  // Recopilar permisos seleccionados
  document.querySelectorAll('.menu-checkbox').forEach(checkbox => {
    const menu = checkbox.getAttribute('data-menu');
    userData.permissions.menus[menu] = checkbox.checked;
  });

  document.querySelectorAll('.submenu-checkbox').forEach(checkbox => {
    const submenu = checkbox.getAttribute('data-submenu');
    userData.permissions.submenus[submenu] = checkbox.checked;
  });

  document.querySelectorAll('[data-element]').forEach(checkbox => {
    const element = checkbox.getAttribute('data-element');
    userData.permissions.elements[element] = checkbox.checked;
  });

  // Guardar en localStorage (simulando DB para maqueta)
  let users = JSON.parse(localStorage.getItem('users')) || [];
  users.push(userData);
  localStorage.setItem('users', JSON.stringify(users));

  alert('Usuario creado exitosamente!');
  document.getElementById('userForm').reset();
  loadDefaultPermissions(); // Reset permisos
});

// Inicializar
loadDefaultPermissions();