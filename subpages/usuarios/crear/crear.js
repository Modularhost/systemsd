
// Lista de menús para cargar sus permisos
const menus = [
  'implantes', 'consignacion', 'historico', 'laboratorio', 'visualizador',
  'prestacion', 'herramientas', 'importacion', 'apuntes', 'migracion',
  'dashboard', 'archivos', 'usuarios', 'configuracion', 'cerrar-sesion'
];

// Estructura para almacenar permisos por defecto
let defaultPermissions = {
  administrador: { menus: {}, submenus: {}, containers: {}, elements: {} },
  operador: { menus: {}, submenus: {}, containers: {}, elements: {} },
  gestor: { menus: {}, submenus: {}, containers: {}, elements: {} }
};

// Cargar permisos dinámicamente
async function loadPermissions() {
  for (const menu of menus) {
    try {
      const response = await fetch(`permisos/${menu}.js`);
      const permissionModule = await response.text();
      // Evaluar el módulo (en producción, usa import dinámico o backend)
      const permissions = eval(`(${permissionModule})`);
      
      // Combinar permisos para cada rol
      ['administrador', 'operador', 'gestor'].forEach(role => {
        defaultPermissions[role].menus[menu] = permissions[role].menu;
        Object.assign(defaultPermissions[role].submenus, permissions[role].submenus);
        Object.assign(defaultPermissions[role].containers, permissions[role].containers);
        Object.assign(defaultPermissions[role].elements, permissions[role].elements);
      });

      // Generar HTML para el árbol de permisos
      const tree = document.getElementById('permissionsTree');
      tree.innerHTML += generatePermissionTree(menu, permissions.structure);
    } catch (error) {
      console.error(`Error al cargar permisos de ${menu}:`, error);
    }
  }
}

// Generar HTML para el árbol de permisos
function generatePermissionTree(menu, structure) {
  let html = `
    <div class="permission-group">
      <label>
        <input type="checkbox" class="menu-checkbox" data-menu="${menu}" onchange="toggleSubmenus(this)">
        ${menu.charAt(0).toUpperCase() + menu.slice(1).replace('-', ' ')} (Menú Principal)
      </label>
      <div class="subpermissions" style="display: none; margin-left: 20px;">
  `;

  structure.submenus.forEach(sub => {
    html += `
      <div class="submenu-group">
        <label>
          <input type="checkbox" class="submenu-checkbox" data-submenu="${menu}-${sub.id}" onchange="toggleContainers(this)">
          ${sub.text}
        </label>
        <div class="containers" style="display: none; margin-left: 40px;">
    `;
    
    sub.containers.forEach(container => {
      html += `
        <div class="container-group">
          <label>
            <input type="checkbox" class="container-checkbox" data-container="${menu}-${sub.id}-${container.id}" onchange="toggleElements(this)">
            ${container.text}
          </label>
          <div class="elements" style="display: none; margin-left: 60px;">
      `;
      
      container.elements.forEach(element => {
        html += `
          <label><input type="checkbox" data-element="${menu}-${sub.id}-${container.id}-${element.id}"> ${element.text}</label><br>
        `;
      });
      
      html += `</div></div>`;
    });
    
    html += `</div></div>`;
  });
  
  html += `</div></div>`;
  return html;
}

// Funciones de toggle
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

function toggleElements(checkbox) {
  const elements = checkbox.parentElement.nextElementSibling;
  if (elements && elements.classList.contains('elements')) {
    elements.style.display = checkbox.checked ? 'block' : 'none';
    if (!checkbox.checked) {
      elements.querySelectorAll('input[type="checkbox"]').forEach(el => el.checked = false);
    }
  }
}

// Cargar permisos por defecto según rol
function loadDefaultPermissions() {
  const role = document.getElementById('role').value;
  const perms = defaultPermissions[role] || { menus: {}, submenus: {}, containers: {}, elements: {} };

  document.querySelectorAll('.menu-checkbox').forEach(checkbox => {
    const menu = checkbox.getAttribute('data-menu');
    checkbox.checked = perms.menus[menu] || false;
    toggleSubmenus(checkbox);
  });

  document.querySelectorAll('.submenu-checkbox').forEach(checkbox => {
    const submenu = checkbox.getAttribute('data-submenu');
    checkbox.checked = perms.submenus[submenu] || false;
    toggleContainers(checkbox);
  });

  document.querySelectorAll('.container-checkbox').forEach(checkbox => {
    const container = checkbox.getAttribute('data-container');
    checkbox.checked = perms.containers[container] || false;
    toggleElements(checkbox);
  });

  document.querySelectorAll('[data-element]').forEach(checkbox => {
    const element = checkbox.getAttribute('data-element');
    checkbox.checked = perms.elements[element] || false;
  });
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
      submenus: {},
      containers: {},
      elements: {}
    }
  };

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

  let users = JSON.parse(localStorage.getItem('users')) || [];
  users.push(userData);
  localStorage.setItem('users', JSON.stringify(users));

  alert('Usuario creado exitosamente!');
  document.getElementById('userForm').reset();
  loadDefaultPermissions();
});

// Inicializar
(async () => {
  await loadPermissions();
  loadDefaultPermissions();
})();
