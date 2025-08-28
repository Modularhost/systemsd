// Lista de menús desde menu.js
const menus = [
  'implantes', 'consignacion', 'historico', 'laboratorio', 'visualizador',
  'prestacion', 'herramientas', 'importacion', 'apuntes', 'migracion',
  'dashboard', 'archivos', 'usuarios', 'configuracion', 'cerrar-sesion'
];

// Estructura para almacenar permisos por defecto
let defaultPermissions = {
  administrador: { menus: {}, submenus: {} },
  operador: { menus: {}, submenus: {} },
  gestor: { menus: {}, submenus: {} }
};

// Configuración de paginación
const itemsPerPage = 5;
let currentPage = 1;

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
              <input type="checkbox" class="submenu-checkbox" data-submenu="${menu}-${sub.id || sub.page}">
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

// Mostrar u ocultar el modal según el rol
function togglePermissionsModal(role) {
  const modal = document.getElementById('permissionsModal');
  if (role === 'operador' || role === 'gestor') {
    modal.style.display = 'flex';
  } else {
    modal.style.display = 'none';
  }
}

// Cargar permisos por defecto según rol
function loadDefaultPermissions() {
  const role = document.getElementById('role').value;
  const perms = defaultPermissions[role] || { menus: {}, submenus: {} };
  const permissionsTree = document.getElementById('permissionsTree');

  togglePermissionsModal(role);

  if (role === 'administrador') {
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

// Cargar datos de usuarios en la tabla con paginación
function loadUsersTable(page = 1) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const tableBody = document.getElementById('usersTableBody');
  const pageInfo = document.getElementById('pageInfo');
  const prevButton = document.getElementById('prevPage');
  const nextButton = document.getElementById('nextPage');

  // Calcular índices de paginación
  const totalPages = Math.ceil(users.length / itemsPerPage);
  currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  // Llenar la tabla
  tableBody.innerHTML = '';
  paginatedUsers.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.fullName}</td>
      <td>${user.username}</td>
      <td>${user.rut}</td>
      <td>${user.dob}</td>
      <td>${user.email}</td>
      <td>${user.sex.charAt(0).toUpperCase() + user.sex.slice(1)}</td>
      <td>${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
    `;
    tableBody.appendChild(row);
  });

  // Actualizar información de paginación
  pageInfo.textContent = `Página ${currentPage} de ${totalPages || 1}`;
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages || totalPages === 0;
}

// Cerrar el modal
document.querySelector('.close-modal').addEventListener('click', () => {
  document.getElementById('permissionsModal').style.display = 'none';
});

// Guardar permisos desde el modal
document.getElementById('savePermissions').addEventListener('click', () => {
  document.getElementById('permissionsModal').style.display = 'none';
});

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
    menus.forEach(menu => {
      userData.permissions.menus[menu] = true;
      if (submenus[menu]) {
        submenus[menu].forEach(sub => {
          userData.permissions.submenus[`${menu}-${sub.id || sub.page}`] = true;
        });
      }
    });
  } else {
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
  document.getElementById('permissionsModal').style.display = 'none';
  loadDefaultPermissions();
  loadUsersTable(currentPage); // Actualizar la tabla manteniendo la página actual
});

// Manejar botones de paginación
document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) {
    loadUsersTable(currentPage - 1);
  }
});

document.getElementById('nextPage').addEventListener('click', () => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const totalPages = Math.ceil(users.length / itemsPerPage);
  if (currentPage < totalPages) {
    loadUsersTable(currentPage + 1);
  }
});

// Inicializar
loadPermissions();
loadDefaultPermissions();
loadUsersTable();