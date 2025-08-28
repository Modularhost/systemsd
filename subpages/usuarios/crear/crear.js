// Verificar que firebase esté definido
if (typeof firebase === 'undefined') {
  console.error('Firebase no está definido. Asegúrate de que los scripts de Firebase se carguen correctamente.');
  alert('Error: Firebase no está cargado. Revisa la consola para más detalles.');
  throw new Error('Firebase no está definido');
}

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB_LByv2DPTs2298UEHSD7cFKZN6L8gtls",
  authDomain: "systemsd-b4678.firebaseapp.com",
  projectId: "systemsd-b4678",
  storageBucket: "systemsd-b4678.firebasestorage.app",
  messagingSenderId: "116607414952",
  appId: "1:116607414952:web:31a7e3f47711844b95889d",
  measurementId: "G-C8V7X0RGH5"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Lista de menús desde menu.js
const menus = [
  'implantes', 'consignacion', 'historico', 'laboratorio', 'visualizador',
  'prestacion', 'herramientas', 'importacion', 'apuntes', 'migracion',
  'dashboard', 'archivos', 'usuarios', 'configuracion', 'cerrar-sesion'
];

// Elementos específicos de la página "Crear" en el módulo "Usuarios"
const createElements = {
  form: { id: 'form', text: 'Formulario' },
  'field-fullName': { id: 'field-fullName', text: 'Campo: Nombre Completo' },
  'field-username': { id: 'field-username', text: 'Campo: Nombre de Usuario' },
  'field-rut': { id: 'field-rut', text: 'Campo: RUT' },
  'field-dob': { id: 'field-dob', text: 'Campo: Fecha de Nacimiento' },
  'field-email': { id: 'field-email', text: 'Campo: Correo Electrónico' },
  'field-password': { id: 'field-password', text: 'Campo: Contraseña' },
  'field-sex': { id: 'field-sex', text: 'Campo: Sexo' },
  'field-role': { id: 'field-role', text: 'Campo: Rol' },
  'submit-button': { id: 'submit-button', text: 'Botón: Crear Usuario' },
  table: { id: 'table', text: 'Tabla de Usuarios' },
  'column-fullName': { id: 'column-fullName', text: 'Columna: Nombre Completo' },
  'column-username': { id: 'column-username', text: 'Columna: Nombre de Usuario' },
  'column-rut': { id: 'column-rut', text: 'Columna: RUT' },
  'column-dob': { id: 'column-dob', text: 'Columna: Fecha de Nacimiento' },
  'column-email': { id: 'column-email', text: 'Columna: Correo Electrónico' },
  'column-sex': { id: 'column-sex', text: 'Columna: Sexo' },
  'column-role': { id: 'column-role', text: 'Columna: Rol' }
};

// Estructura para almacenar permisos por defecto
let defaultPermissions = {
  administrador: { menus: {}, submenus: {}, elements: {} },
  operador: { menus: {}, submenus: {}, elements: {} },
  gestor: { menus: {}, submenus: {}, elements: {} }
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
        <div class="subpermissions" style="display: none;">
    `;

    // Agregar submenús (si existen)
    if (window.submenus && window.submenus[menu]) {
      window.submenus[menu].forEach(sub => {
        html += `
          <div class="submenu-group">
            <label>
              <input type="checkbox" class="submenu-checkbox" data-submenu="${menu}-${sub.page}" onchange="toggleElements(this)">
              ${sub.text}
            </label>
        `;

        // Agregar elementos específicos para el submenú "Crear" en "Usuarios"
        if (menu === 'usuarios' && sub.page === 'crear') {
          html += `
            <div class="elements" style="display: none;">
          `;
          Object.values(createElements).forEach(element => {
            html += `
              <div class="element-group">
                <label>
                  <input type="checkbox" class="element-checkbox" data-element="usuarios-crear-${element.id}">
                  ${element.text}
                </label>
              </div>
            `;
          });
          html += `</div>`;
        }

        html += `</div>`;
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
      subperms.querySelectorAll('input[type="checkbox"]').forEach(sub => {
        sub.checked = false;
        if (sub.classList.contains('submenu-checkbox')) {
          const elements = sub.parentElement.nextElementSibling;
          if (elements && elements.classList.contains('elements')) {
            elements.style.display = 'none';
            elements.querySelectorAll('input[type="checkbox"]').forEach(el => el.checked = false);
          }
        }
      });
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
  const perms = defaultPermissions[role] || { menus: {}, submenus: {}, elements: {} };
  const permissionsTree = document.getElementById('permissionsTree');

  togglePermissionsModal(role);

  if (role === 'administrador') {
    document.querySelectorAll('.menu-checkbox').forEach(checkbox => {
      checkbox.checked = true;
      checkbox.disabled = true;
      toggleSubmenus(checkbox);
      const subperms = checkbox.parentElement.nextElementSibling;
      subperms.querySelectorAll('.submenu-checkbox').forEach(sub => {
        sub.checked = true;
        sub.disabled = true;
        toggleElements(sub);
        const elements = sub.parentElement.nextElementSibling;
        if (elements && elements.classList.contains('elements')) {
          elements.querySelectorAll('.element-checkbox').forEach(el => {
            el.checked = true;
            el.disabled = true;
          });
        }
      });
    });
  } else {
    document.querySelectorAll('.menu-checkbox').forEach(checkbox => {
      checkbox.disabled = false;
      const menu = checkbox.getAttribute('data-menu');
      checkbox.checked = perms.menus[menu] || false;
      toggleSubmenus(checkbox);
      const subperms = checkbox.parentElement.nextElementSibling;
      subperms.querySelectorAll('.submenu-checkbox').forEach(sub => {
        sub.disabled = false;
        const submenu = sub.getAttribute('data-submenu');
        sub.checked = perms.submenus[submenu] || false;
        toggleElements(sub);
        const elements = sub.parentElement.nextElementSibling;
        if (elements && elements.classList.contains('elements')) {
          elements.querySelectorAll('.element-checkbox').forEach(el => {
            el.disabled = false;
            const element = el.getAttribute('data-element');
            el.checked = perms.elements[element] || false;
          });
        }
      });
    });
  }
}

// Cargar datos de usuarios en la tabla con paginación
async function loadUsersTable(page = 1) {
  const tableBody = document.getElementById('usersTableBody');
  const pageInfo = document.getElementById('pageInfo');
  const prevButton = document.getElementById('prevPage');
  const nextButton = document.getElementById('nextPage');

  try {
    // Obtener usuarios desde Firestore
    const usersSnapshot = await db.collection('users').get();
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

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
        <td ${user.permissions.elements['usuarios-crear-column-fullName'] ? '' : 'class="hidden"'}>${user.fullName}</td>
        <td ${user.permissions.elements['usuarios-crear-column-username'] ? '' : 'class="hidden"'}>${user.username}</td>
        <td ${user.permissions.elements['usuarios-crear-column-rut'] ? '' : 'class="hidden"'}>${user.rut}</td>
        <td ${user.permissions.elements['usuarios-crear-column-dob'] ? '' : 'class="hidden"'}>${user.dob}</td>
        <td ${user.permissions.elements['usuarios-crear-column-email'] ? '' : 'class="hidden"'}>${user.email}</td>
        <td ${user.permissions.elements['usuarios-crear-column-sex'] ? '' : 'class="hidden"'}>${user.sex.charAt(0).toUpperCase() + user.sex.slice(1)}</td>
        <td ${user.permissions.elements['usuarios-crear-column-role'] ? '' : 'class="hidden"'}>${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
      `;
      tableBody.appendChild(row);
    });

    // Actualizar información de paginación
    pageInfo.textContent = `Página ${currentPage} de ${totalPages || 1}`;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages || totalPages === 0;
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
    alert(`Error al cargar usuarios: ${error.message}`);
  }
}

// Aplicar permisos al cargar la página
async function applyPermissions() {
  const user = auth.currentUser;
  if (user) {
    try {
      const userDoc = await db.collection('users').doc(user.uid).get();
      if (userDoc.exists) {
        const perms = userDoc.data().permissions;

        // Ocultar/mostrar elementos del formulario
        document.querySelectorAll('[data-permission]').forEach(element => {
          const permission = element.getAttribute('data-permission');
          if (permission === 'form') {
            element.classList.toggle('hidden', !perms.elements['usuarios-crear-form']);
          } else if (permission.startsWith('field-') || permission === 'submit-button') {
            element.classList.toggle('hidden', !perms.elements[`usuarios-crear-${permission}`]);
          } else if (permission === 'table') {
            element.classList.toggle('hidden', !perms.elements['usuarios-crear-table']);
          } else if (permission.startsWith('column-')) {
            element.classList.toggle('hidden', !perms.elements[`usuarios-crear-${permission}`]);
          }
        });

        // Ocultar/mostrar columnas dinámicamente en la tabla
        await loadUsersTable(currentPage);
      } else {
        console.warn('Usuario autenticado no encontrado en Firestore');
      }
    } catch (error) {
      console.error('Error al aplicar permisos:', error);
      alert(`Error al aplicar permisos: ${error.message}`);
    }
  } else {
    console.warn('No hay usuario autenticado');
  }
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
document.getElementById('userForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const userData = {
    fullName: document.getElementById('fullName').value,
    username: document.getElementById('username').value,
    rut: document.getElementById('rut').value,
    dob: document.getElementById('dob').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    sex: document.getElementById('sex').value,
    role: document.getElementById('role').value,
    permissions: {
      menus: {},
      submenus: {},
      elements: {}
    }
  };

  try {
    // Crear usuario en Firebase Authentication
    const userCredential = await auth.createUserWithEmailAndPassword(userData.email, userData.password);
    const user = userCredential.user;

    // Asignar permisos según el rol
    if (userData.role === 'administrador') {
      menus.forEach(menu => {
        userData.permissions.menus[menu] = true;
        if (window.submenus && window.submenus[menu]) {
          window.submenus[menu].forEach(sub => {
            userData.permissions.submenus[`${menu}-${sub.page}`] = true;
            if (menu === 'usuarios' && sub.page === 'crear') {
              Object.keys(createElements).forEach(element => {
                userData.permissions.elements[`usuarios-crear-${element}`] = true;
              });
            }
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
      document.querySelectorAll('.element-checkbox').forEach(checkbox => {
        userData.permissions.elements[checkbox.getAttribute('data-element')] = checkbox.checked;
      });
    }

    // Guardar datos del usuario en Firestore
    await db.collection('users').doc(user.uid).set({
      uid: user.uid,
      fullName: userData.fullName,
      username: userData.username,
      rut: userData.rut,
      dob: userData.dob,
      email: userData.email,
      sex: userData.sex,
      role: userData.role,
      permissions: userData.permissions
    });

    alert('Usuario creado exitosamente!');
    document.getElementById('userForm').reset();
    document.getElementById('permissionsModal').style.display = 'none';
    loadDefaultPermissions();
    await loadUsersTable(currentPage);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    alert(`Error al crear usuario: ${error.message}`);
  }
});

// Manejar botones de paginación
document.getElementById('prevPage').addEventListener('click', async () => {
  if (currentPage > 1) {
    await loadUsersTable(currentPage - 1);
  }
});

document.getElementById('nextPage').addEventListener('click', async () => {
  const usersSnapshot = await db.collection('users').get();
  const totalPages = Math.ceil(usersSnapshot.docs.length / itemsPerPage);
  if (currentPage < totalPages) {
    await loadUsersTable(currentPage + 1);
  }
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  loadPermissions();
  loadDefaultPermissions();
  loadUsersTable();
  auth.onAuthStateChanged(user => {
    if (user) {
      applyPermissions();
    }
  });
});