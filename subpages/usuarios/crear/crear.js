// subpages/usuarios/crear/crear.js

// Permisos por defecto según rol (expandido con niveles granulares)
const defaultPermissions = {
  administrador: {
    menus: { /* Todos true */
      implantes: true,
      laboratorio: true,
      // Agrega todos los menús...
    },
    submenus: { /* Todos true */
      'implantes-ingresos': true,
      'implantes-cargar': true,
      'implantes-pacientes': true,
      'implantes-referencias': true,
      'laboratorio-analisis': true,
      'laboratorio-resultados': true,
      // ...
    },
    containers: { /* Todos true */
      'implantes-ingresos-formulario': true,
      'implantes-ingresos-tabla': true,
      'implantes-cargar-formulario': true,
      'implantes-cargar-tabla': true,
      // ...
    },
    elements: { /* Todos true */
      'implantes-cargar-formulario-campo-archivo': true,
      'implantes-cargar-formulario-campo-descripcion': true,
      'implantes-cargar-formulario-boton-subir': true,
      'implantes-cargar-formulario-boton-limpiar': true,
      'implantes-cargar-tabla-columna-id': true,
      'implantes-cargar-tabla-columna-archivo': true,
      'implantes-cargar-tabla-columna-fecha': true,
      'implantes-cargar-tabla-paginacion': true,
      'implantes-cargar-tabla-boton-descargar': true,
      'implantes-cargar-tabla-boton-importar': true,
      'implantes-cargar-tabla-boton-editar': true,
      // Agrega todos los elementos para admin
    }
  },
  operador: {
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
    containers: {
      'implantes-cargar-formulario': true,
      'implantes-cargar-tabla': true,
      'laboratorio-analisis-formulario': true,
      'laboratorio-analisis-tabla': true,
    },
    elements: {
      'implantes-cargar-formulario-campo-archivo': true,
      'implantes-cargar-formulario-campo-descripcion': true,
      'implantes-cargar-formulario-boton-subir': true,
      'implantes-cargar-formulario-boton-limpiar': true,
      'implantes-cargar-tabla-columna-id': true,
      'implantes-cargar-tabla-columna-archivo': true,
      'implantes-cargar-tabla-columna-fecha': true,
      'implantes-cargar-tabla-paginacion': true,
      'implantes-cargar-tabla-boton-descargar': false, // Oculto como ejemplo
      'implantes-cargar-tabla-boton-importar': true,
      'implantes-cargar-tabla-boton-editar': true,
      // Para laboratorio-analisis, similar, algunos false si quieres restringir
    }
  },
  gestor: {
    // Personaliza similar a operador, ajusta según necesidades específicas
    menus: {
      implantes: true,
      laboratorio: true,
    },
    submenus: {
      'implantes-ingresos': true, // Ejemplo: gestor ve más que operador
      'implantes-cargar': true,
      'implantes-pacientes': true,
      'implantes-referencias': false,
      'laboratorio-analisis': true,
      'laboratorio-resultados': true,
    },
    containers: {
      // Similar, con más true
    },
    elements: {
      // Similar, ajusta restricciones
      'implantes-cargar-tabla-boton-descargar': true, // Ejemplo: gestor sí ve descargar
    }
  }
};

// Función para cargar permisos por defecto según rol
function loadDefaultPermissions() {
  const role = document.getElementById('role').value;
  const perms = defaultPermissions[role] || { menus: {}, submenus: {}, containers: {}, elements: {} };

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
    toggleContainers(checkbox);
  });

  // Marcar contenedores
  document.querySelectorAll('.container-checkbox').forEach(checkbox => {
    const container = checkbox.getAttribute('data-container');
    checkbox.checked = perms.containers[container] || false;
    toggleElements(checkbox);
  });

  // Marcar elementos
  document.querySelectorAll('[data-element]').forEach(checkbox => {
    const element = checkbox.getAttribute('data-element');
    checkbox.checked = perms.elements[element] || false;
  });
}

// Función para toggle submenús bajo menú
function toggleSubmenus(checkbox) {
  const subperms = checkbox.parentElement.nextElementSibling;
  if (subperms && subperms.classList.contains('subpermissions')) {
    subperms.style.display = checkbox.checked ? 'block' : 'none';
    if (!checkbox.checked) {
      subperms.querySelectorAll('input[type="checkbox"]').forEach(sub => sub.checked = false);
      subperms.querySelectorAll('.containers, .elements').forEach(el => el.style.display = 'none');
    }
  }
}

// Función para toggle contenedores bajo submenú
function toggleContainers(checkbox) {
  const containers = checkbox.parentElement.nextElementSibling;
  if (containers && containers.classList.contains('containers')) {
    containers.style.display = checkbox.checked ? 'block' : 'none';
    if (!checkbox.checked) {
      containers.querySelectorAll('input[type="checkbox"]').forEach(sub => sub.checked = false);
      containers.querySelectorAll('.elements').forEach(el => el.style.display = 'none');
    }
  }
}

// Función para toggle elementos bajo contenedor
function toggleElements(checkbox) {
  const elements = checkbox.parentElement.nextElementSibling;
  if (elements && elements.classList.contains('elements')) {
    elements.style.display = checkbox.checked ? 'block' : 'none';
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
      containers: {},
      elements: {}
    }
  };

  // Recopilar permisos
  document.querySelectorAll('.menu-checkbox').forEach(checkbox => {
    userData.permissions.menus[checkbox.getAttribute('data-menu')] = checkbox.checked;
  });
  document.querySelectorAll('.submenu-checkbox').forEach(checkbox => {
    userData.permissions.submenus[checkbox.getAttribute('data-submenu')] = checkbox.checked;
  });
  document.querySelectorAll('.container-checkbox').forEach(checkbox => {
    userData.permissions.containers[checkbox.getAttribute('data-container')] = checkbox.checked;
  });
  document.querySelectorAll('[data-element]').forEach(checkbox => {
    userData.permissions.elements[checkbox.getAttribute('data-element')] = checkbox.checked;
  });

  // Guardar en localStorage (maqueta)
  let users = JSON.parse(localStorage.getItem('users')) || [];
  users.push(userData);
  localStorage.setItem('users', JSON.stringify(users));

  alert('Usuario creado exitosamente!');
  document.getElementById('userForm').reset();
  loadDefaultPermissions();
});

// Inicializar
loadDefaultPermissions();