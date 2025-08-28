// Variables globales para Firebase
let auth = null;
let db = null;

// Lista de menús
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

// Estructura para permisos por defecto
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
  console.log('Ejecutando loadPermissions...');
  const tree = document.getElementById('permissionsTree');
  if (!tree) {
    console.error('Elemento permissionsTree no encontrado');
    return;
  }
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

    if (window.submenus && window.submenus[menu]) {
      window.submenus[menu].forEach(sub => {
        html += `
          <div class="submenu-group">
            <label>
              <input type="checkbox" class="submenu-checkbox" data-submenu="${menu}-${sub.page}" onchange="toggleElements(this)">
              ${sub.text}
            </label>
        `;

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
  console.log('Ejecutando toggleSubmenus:', checkbox.getAttribute('data-menu'));
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
  console.log('Ejecutando toggleElements:', checkbox.getAttribute('data-submenu'));
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
  console.log('Ejecutando togglePermissionsModal:', role);
  const modal = document.getElementById('permissionsModal');
  if (!modal) {
    console.error('Elemento permissionsModal no encontrado');
    return;
  }
  if (role === 'operador' || role === 'gestor') {
    modal.style.display = 'flex';
  } else {
    modal.style.display = 'none';
  }
}

// Cargar permisos por defecto según rol
function loadDefaultPermissions() {
  console.log('Ejecutando loadDefaultPermissions...');
  const role = document.getElementById('role').value;
  console.log('Rol seleccionado:', role);
  const perms = defaultPermissions[role] || { menus: {}, submenus: {}, elements: {} };
  const permissionsTree = document.getElementById('permissionsTree');
  if (!permissionsTree) {
    console.error('Elemento permissionsTree no encontrado');
    return;
  }

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

// Función para cargar scripts dinámicamente
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = () => {
      console.log(`Script cargado: ${src}`);
      resolve();
    };
    script.onerror = () => {
      console.error(`Error al cargar el script: ${src}`);
      reject(new Error(`Error al cargar el script: ${src}`));
    };
    document.head.appendChild(script);
  });
}

// Cargar scripts de Firebase en orden
async function loadFirebaseScripts() {
  try {
    console.log('Iniciando carga de scripts de Firebase...');
    await loadScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js');
    await loadScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js');
    await loadScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js');
    if (typeof firebase === 'undefined') {
      throw new Error('Firebase no está definido después de cargar los scripts');
    }
    console.log('Todos los scripts de Firebase cargados correctamente');
    initializeApp();
  } catch (error) {
    console.error('Error al cargar scripts de Firebase:', error);
    alert(`Error al cargar Firebase: ${error.message}. Revisa la consola para más detalles.`);
  }
}

// Configuración de Firebase y lógica principal
function initializeApp() {
  console.log('Ejecutando initializeApp...');
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
  try {
    console.log('Inicializando Firebase...');
    const app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    console.log('Firebase inicializado correctamente:', { app, auth, db });
  } catch (error) {
    console.error('Error al inicializar Firebase:', error);
    alert(`Error al inicializar Firebase: ${error.message}`);
    return;
  }

  // Cargar datos de usuarios en la tabla con paginación
  async function loadUsersTable(page = 1) {
    console.log('Ejecutando loadUsersTable:', page);
    const tableBody = document.getElementById('usersTableBody');
    const pageInfo = document.getElementById('pageInfo');
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');

    try {
      const usersSnapshot = await db.collection('users').get();
      console.log('Usuarios obtenidos:', usersSnapshot.docs.length);
      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const totalPages = Math.ceil(users.length / itemsPerPage);
      currentPage = Math.max(1, Math.min(page, totalPages));
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedUsers = users.slice(startIndex, endIndex);

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
    console.log('Ejecutando applyPermissions...');
    const user = auth.currentUser;
    if (user) {
      try {
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          const perms = userDoc.data().permissions;

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
    console.log('Cerrando modal de permisos');
    document.getElementById('permissionsModal').style.display = 'none';
  });

  // Guardar permisos desde el modal
  document.getElementById('savePermissions').addEventListener('click', () => {
    console.log('Guardando permisos desde el modal');
    document.getElementById('permissionsModal').style.display = 'none';
  });

  // Manejar envío del formulario
  document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Formulario enviado');

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
    console.log('Datos del formulario:', userData);

    if (!auth) {
      console.error('Firebase Auth no está inicializado');
      alert('Error: Firebase Auth no está inicializado');
      return;
    }

    try {
      console.log('Creando usuario en Firebase Authentication...');
      const userCredential = await auth.createUserWithEmailAndPassword(userData.email, userData.password);
      const user = userCredential.user;
      console.log('Usuario creado en Authentication:', user.uid);

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

      console.log('Guardando datos en Firestore...');
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
      console.log('Datos guardados en Firestore para el usuario:', user.uid);

      alert('Usuario creado exitosamente!');
      document.getElementById('userForm').reset();
      document.getElementById('permissionsModal').style.display = 'none';
      loadDefaultPermissions();
      await loadUsersTable(currentPage);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      alert(`Error al crear usuario: ${error.code} - ${error.message}`);
    }
  });

  // Manejar botones de paginación
  document.getElementById('prevPage').addEventListener('click', async () => {
    console.log('Clic en Anterior, página actual:', currentPage);
    if (currentPage > 1) {
      await loadUsersTable(currentPage - 1);
    }
  });

  document.getElementById('nextPage').addEventListener('click', async () => {
    console.log('Clic en Siguiente, página actual:', currentPage);
    const usersSnapshot = await db.collection('users').get();
    const totalPages = Math.ceil(usersSnapshot.docs.length / itemsPerPage);
    if (currentPage < totalPages) {
      await loadUsersTable(currentPage + 1);
    }
  });

  // Inicializar
  loadPermissions();
  loadDefaultPermissions();
  loadUsersTable();
  auth.onAuthStateChanged(user => {
    console.log('Estado de autenticación cambiado:', user ? user.uid : 'No autenticado');
    if (user) {
      applyPermissions();
    }
  });
}

// Iniciar la carga de scripts de Firebase
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded disparado, iniciando carga de Firebase...');
  loadFirebaseScripts();
});