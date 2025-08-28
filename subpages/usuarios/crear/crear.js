// Lista de menús desde menu.html
const menus = [
  'implantes', 'consignacion', 'historico', 'laboratorio', 'visualizador',
  'prestacion', 'herramientas', 'importacion', 'apuntes', 'migracion',
  'dashboard', 'archivos', 'usuarios', 'configuracion', 'cerrar-sesion'
];

// Submenús desde menu.js
const submenus = {
  implantes: [
    { id: 'ingresos', text: 'Ingresos', page: 'ingresos', folder: 'implantes', jsFiles: ['ingresos'] },
    { id: 'cargar', text: 'Cargar', page: 'cargar', folder: 'implantes', jsFiles: ['cargar'] },
    { id: 'pacientes', text: 'Pacientes', page: 'pacientes', folder: 'implantes', jsFiles: ['pacientes'] },
    { id: 'referencias', text: 'Referencias', page: 'referencias', folder: 'implantes', jsFiles: ['referencias'] }
  ],
  consignacion: [
    { id: 'registro', text: 'Registro', page: 'registro', folder: 'consignacion', jsFiles: ['registro'] },
    { id: 'seguimiento', text: 'Seguimiento', page: 'seguimiento', folder: 'consignacion', jsFiles: ['seguimiento'] },
    { id: 'reportes', text: 'Reportes', page: 'reportes', folder: 'consignacion', jsFiles: ['reportes'] }
  ],
  historico: [
    { id: 'consultas', text: 'Consultas', page: 'consultas', folder: 'historico', jsFiles: ['consultas'] },
    { id: 'archivos', text: 'Archivos', page: 'archivos', folder: 'historico', jsFiles: ['archivos'] }
  ],
  laboratorio: [
    { id: 'analisis', text: 'Análisis', page: 'analisis', folder: 'laboratorio', jsFiles: ['analisis'] },
    { id: 'resultados', text: 'Resultados', page: 'resultados', folder: 'laboratorio', jsFiles: ['resultados'] }
  ],
  visualizador: [
    { id: 'graficos', text: 'Gráficos', page: 'graficos', folder: 'visualizador', jsFiles: ['graficos'] },
    { id: 'imagenes', text: 'Imágenes', page: 'imagenes', folder: 'visualizador', jsFiles: ['imagenes'] }
  ],
  prestacion: [
    { id: 'empresas', text: 'Empresas', page: 'empresas', folder: 'prestacion', jsFiles: ['empresas'] },
    { id: 'medicos', text: 'Médicos', page: 'medicos', folder: 'prestacion', jsFiles: ['medicos'] },
    { id: 'areas', text: 'Areas', page: 'areas', folder: 'prestacion', jsFiles: ['areas'] }
  ],
  herramientas: [
    { id: 'utilidades', text: 'Utilidades', page: 'utilidades', folder: 'herramientas', jsFiles: ['utilidades'] },
    { id: 'configuracion-herramientas', text: 'Configuración', page: 'configuracion-herramientas', folder: 'herramientas', jsFiles: ['configuracion-herramientas'] }
  ],
  importacion: [
    { id: 'carga-masiva', text: 'Carga Masiva', page: 'carga-masiva', folder: 'importacion', jsFiles: ['carga-masiva'] },
    { id: 'validacion', text: 'Validación', page: 'validacion', folder: 'importacion', jsFiles: ['validacion'] }
  ],
  apuntes: [
    { id: 'notas', text: 'Notas', page: 'notas', folder: 'apuntes', jsFiles: ['notas'] },
    { id: 'recordatorios', text: 'Recordatorios', page: 'recordatorios', folder: 'apuntes', jsFiles: ['recordatorios'] }
  ],
  migracion: [
    { id: 'transferencia', text: 'Transferencia', page: 'transferencia', folder: 'migracion', jsFiles: ['transferencia'] },
    { id: 'sincronizacion', text: 'Sincronización', page: 'sincronizacion', folder: 'migracion', jsFiles: ['sincronizacion'] }
  ],
  dashboard: [
    { id: 'resumen', text: 'Resumen', page: 'resumen', folder: 'dashboard', jsFiles: ['resumen'] },
    { id: 'estadisticas', text: 'Estadísticas', page: 'estadisticas', folder: 'dashboard', jsFiles: ['estadisticas'] }
  ],
  archivos: [
    { id: 'subir', text: 'Subir', page: 'subir', folder: 'archivos', jsFiles: ['subir'] },
    { id: 'gestionar', text: 'Gestionar', page: 'gestionar', folder: 'archivos', jsFiles: ['gestionar'] }
  ],
  usuarios: [
    { id: 'crear', text: 'Crear', page: 'crear', folder: 'usuarios', jsFiles: ['crear'] },
    { id: 'editar', text: 'Editar', page: 'editar', folder: 'usuarios', jsFiles: ['editar'] }
  ],
  configuracion: [
    { id: 'sistema', text: 'Sistema', page: 'sistema', folder: 'configuracion', jsFiles: ['sistema'] },
    { id: 'preferencias', text: 'Preferencias', page: 'preferencias', folder: 'configuracion', jsFiles: ['preferencias'] }
  ],
  'cerrar-sesion': [
    { id: 'confirmar-cerrar-sesion', text: 'Confirmar', page: 'confirmar-cerrar-sesion', folder: 'cerrar-sesion', jsFiles: ['confirmar-cerrar-sesion'] }
  ]
};

// Estructura para almacenar permisos por defecto
let defaultPermissions = {
  administrador: { menus: {}, submenus: {} },
  operador: { menus: {}, submenus: {} },
  gestor: { menus: {}, submenus: {} }
};

// Cargar permisos dinámicamente
function loadPermissions() {
  const tree = document.getElementById('permissionsTree');
  tree.innerHTML = '';

  menus.forEach(menu => {
    const menuText = menu.charAt(0).toUpperCase() + menu.slice(1).replace('-', ' ');
    let html = `
      <div class="permission-group">
        <label>
          <input type="checkbox" class="menu-checkbox" data-menu="${menu}" onchange="toggleSubmenus(this)">
          ${menuText} (Menú Principal)
        </label>
        <div class="subpermissions" style="display: none; margin-left: 20px;">
    `;

    if (submenus[menu]) {
      submenus[menu].forEach(sub => {
        html += `
          <div class="submenu-group">
            <label>
              <input type="checkbox" class="submenu-checkbox" data-submenu="${menu}-${sub.id}">
              ${sub.text}
            </label>
          </div>
        `;
      });
    }

    html += `</div></div>`;
    tree.innerHTML += html;
  });
}

// Funciones de toggle
function toggleSubmenus(checkbox) {
  const subperms = checkbox.parentElement.nextElementSibling;
  if (subperms && subperms.classList.contains('subpermissions')) {
    subperms.style.display = checkbox.checked ? 'block' : 'none';
    if (!checkbox.checked) {
      subperms.querySelectorAll('input[type="checkbox"]').forEach(sub => sub.checked = false);
    }
  }
}

// Cargar permisos por defecto según rol
function loadDefaultPermissions() {
  const role = document.getElementById('role').value;
  const perms = defaultPermissions[role] || { menus: {}, submenus: {} };
  const permissionsTree = document.getElementById('permissionsTree');

  if (role === 'administrador') {
    // Administradores tienen acceso completo
    permissionsTree.style.display = 'none';
    document.querySelectorAll('.menu-checkbox').forEach(checkbox => {
      checkbox.checked = true;
      checkbox.disabled = true;
      toggleSubmenus(checkbox);
      checkbox.parentElement.nextElementSibling.querySelectorAll('.submenu-checkbox').forEach(sub => {
        sub.checked = true;
        sub.disabled = true;
      });
    });
  } else {
    permissionsTree.style.display = 'block';
    document.querySelectorAll('.menu-checkbox').forEach(checkbox => {
      checkbox.disabled = false;
      const menu = checkbox.getAttribute('data-menu');
      checkbox.checked = perms.menus[menu] || false;
      toggleSubmenus(checkbox);
      checkbox.parentElement.nextElementSibling.querySelectorAll('.submenu-checkbox').forEach(sub => {
        sub.disabled = false;
        const submenu = sub.getAttribute('data-submenu');
        sub.checked = perms.submenus[submenu] || false;
      });
    });
  }
}

// Manejar envío del formulario
document.getElementById('userForm').addEventListener('submit', (e) => {
  e.preventDefault();

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
      submenus: {}
    }
  };

  if (userData.role === 'administrador') {
    // Asignar todos los permisos para administradores
    menus.forEach(menu => {
      userData.permissions.menus[menu] = true;
      if (submenus[menu]) {
        submenus[menu].forEach(sub => {
          userData.permissions.submenus[`${menu}-${sub.id}`] = true;
        });
      }
    });
  } else {
    // Asignar permisos seleccionados para operadores y gestores
    document.querySelectorAll('.menu-checkbox').forEach(checkbox => {
      userData.permissions.menus[checkbox.getAttribute('data-menu')] = checkbox.checked;
    });
    document.querySelectorAll('.submenu-checkbox').forEach(checkbox => {
      userData.permissions.submenus[checkbox.getAttribute('data-submenu')] = checkbox.checked;
    });
  }

  let users = JSON.parse(localStorage.getItem('users')) || [];
  users.push(userData);
  localStorage.setItem('users', JSON.stringify(users));

  alert('Usuario creado exitosamente!');
  document.getElementById('userForm').reset();
  loadDefaultPermissions();
});

// Inicializar
loadPermissions();
loadDefaultPermissions();