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
  'field-fullName': { id: 'fullName', text: 'Campo: Nombre Completo' },
  'field-username': { id: 'username', text: 'Campo: Nombre de Usuario' },
  'field-rut': { id: 'rut', text: 'Campo: RUT' },
  'field-dob': { id: 'dob', text: 'Campo: Fecha de Nacimiento' },
  'field-email': { id: 'email', text: 'Campo: Correo Electrónico' },
  'field-password': { id: 'password', text: 'Campo: Contraseña' },
  'field-sex': { id: 'sex', text: 'Campo: Sexo' },
  'field-role': { id: 'role', text: 'Campo: Rol' },
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

// Variable para controlar si Firebase está listo
let firebaseReady = false;

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
  const roleSelect = document.getElementById('role');
  if (!roleSelect) {
    console.error('Elemento role no encontrado');
    return;
  }
  
  const role = roleSelect.value;
  console.log('Rol seleccionado:', role);
  
  if (!role) return; // Si no hay rol seleccionado, no hacer nada
  
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
      if (subperms) {
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
      }
    });
  } else {
    document.querySelectorAll('.menu-checkbox').forEach(checkbox => {
      checkbox.disabled = false;
      const menu = checkbox.getAttribute('data-menu');
      checkbox.checked = perms.menus[menu] || false;
      toggleSubmenus(checkbox);
      const subperms = checkbox.parentElement.nextElementSibling;
      if (subperms) {
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
      }
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
    await initializeApp();
  } catch (error) {
    console.error('Error al cargar scripts de Firebase:', error);
    alert(`Error al cargar Firebase: ${error.message}. Revisa la consola para más detalles.`);
  }
}

// Configuración de Firebase y lógica principal
async function initializeApp() {
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
    firebaseReady = true;
  } catch (error) {
    console.error('Error al inicializar Firebase:', error);
    alert(`Error al inicializar Firebase: ${error.message}`);
    return;
  }

  // Configurar el manejador del formulario
  setupFormHandler();
  
  // Configurar otros manejadores de eventos
  setupEventHandlers();
  
  // Inicializar componentes
  loadPermissions();
  loadDefaultPermissions();
  await loadUsersTable();
  
  // Configurar autenticación
  if (auth) {
    auth.onAuthStateChanged(user => {
      console.log('Estado de autenticación cambiado:', user ? user.uid : 'No autenticado');
      if (user) {
        applyPermissions();
      }
    });
  }
}

// Configurar el manejador del formulario
function setupFormHandler() {
  const userForm = document.getElementById('userForm');
  if (!userForm) {
    console.error('Formulario userForm no encontrado');
    return;
  }

  console.log('Configurando manejador del formulario...');
  
  // Agregar el listener al formulario existente
  userForm.addEventListener('submit', handleFormSubmit);
  
  // También agregar listener al botón directamente como respaldo
  const submitButton = userForm.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.addEventListener('click', handleButtonClick);
  }
  
  console.log('Manejador del formulario configurado correctamente');
}

// Manejar clic en el botón (respaldo)
async function handleButtonClick(e) {
  e.preventDefault();
  e.stopPropagation();
  
  console.log('=== BOTÓN CREAR USUARIO CLICKEADO ===');
  
  if (!firebaseReady) {
    console.error('Firebase no está listo');
    alert('Error: Firebase no está listo. Espera un momento e intenta de nuevo.');
    return;
  }

  if (!auth || !db) {
    console.error('Firebase Auth o Firestore no están inicializados');
    alert('Error: Firebase no está correctamente inicializado');
    return;
  }

  // Validar formulario manualmente
  const form = document.getElementById('userForm');
  if (!form.checkValidity()) {
    console.log('Formulario no es válido, mostrando errores');
    form.reportValidity();
    return;
  }
  
  console.log('Formulario válido, procesando creación de usuario...');
  
  // Procesar la creación del usuario
  await processUserCreation();
}

// Procesar la creación del usuario
async function processUserCreation() {
  console.log('=== INICIANDO CREACIÓN DE USUARIO ===');

  // Recopilar datos del formulario
  const userData = {
    fullName: document.getElementById('fullName')?.value?.trim() || '',
    username: document.getElementById('username')?.value?.trim() || '',
    rut: document.getElementById('rut')?.value?.trim() || '',
    dob: document.getElementById('dob')?.value || '',
    email: document.getElementById('email')?.value?.trim() || '',
    password: document.getElementById('password')?.value || '',
    sex: document.getElementById('sex')?.value || '',
    role: document.getElementById('role')?.value || '',
    permissions: {
      menus: {},
      submenus: {},
      elements: {}
    }
  };
  
  console.log('Datos del formulario recopilados:', userData);

  // Validar datos del formulario
  const validation = validateUserData(userData);
  if (!validation.valid) {
    console.error('Validación fallida:', validation.message);
    alert(`Error: ${validation.message}`);
    return;
  }

  try {
    console.log('Creando usuario en Firebase Authentication...');
    const userCredential = await auth.createUserWithEmailAndPassword(userData.email, userData.password);
    const user = userCredential.user;
    console.log('Usuario creado en Authentication con UID:', user.uid);

    // Configurar permisos según el rol
    configurePermissions(userData);

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
      permissions: userData.permissions,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('Datos guardados exitosamente en Firestore');

    // Mostrar mensaje de éxito
    alert('¡Usuario creado exitosamente!');
    
    // Limpiar formulario y UI
    resetForm();
    
    // Recargar tabla de usuarios
    await loadUsersTable(currentPage);
    
    console.log('=== CREACIÓN DE USUARIO COMPLETADA ===');
    
  } catch (error) {
    console.error('Error al crear usuario:', error);
    let errorMessage = 'Error desconocido';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'El correo electrónico ya está en uso';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Correo electrónico inválido';
        break;
      case 'auth/weak-password':
        errorMessage = 'La contraseña es muy débil';
        break;
      default:
        errorMessage = `${error.code || 'Error'}: ${error.message}`;
    }
    
    alert(`Error al crear usuario: ${errorMessage}`);
  }
}

// Manejar el envío del formulario
async function handleFormSubmit(e) {
  e.preventDefault();
  e.stopPropagation();
  
  console.log('=== INICIANDO CREACIÓN DE USUARIO ===');
  console.log('Evento submit capturado correctamente');
  
  if (!firebaseReady) {
    console.error('Firebase no está listo');
    alert('Error: Firebase no está listo. Espera un momento e intenta de nuevo.');
    return;
  }

  if (!auth || !db) {
    console.error('Firebase Auth o Firestore no están inicializados');
    alert('Error: Firebase no está correctamente inicializado');
    return;
  }

  // Recopilar datos del formulario
  const userData = {
    fullName: document.getElementById('fullName')?.value?.trim() || '',
    username: document.getElementById('username')?.value?.trim() || '',
    rut: document.getElementById('rut')?.value?.trim() || '',
    dob: document.getElementById('dob')?.value || '',
    email: document.getElementById('email')?.value?.trim() || '',
    password: document.getElementById('password')?.value || '',
    sex: document.getElementById('sex')?.value || '',
    role: document.getElementById('role')?.value || '',
    permissions: {
      menus: {},
      submenus: {},
      elements: {}
    }
  };
  
  console.log('Datos del formulario recopilados:', userData);

  // Validar datos del formulario
  const validation = validateUserData(userData);
  if (!validation.valid) {
    console.error('Validación fallida:', validation.message);
    alert(`Error: ${validation.message}`);
    return;
  }

  try {
    console.log('Creando usuario en Firebase Authentication...');
    const userCredential = await auth.createUserWithEmailAndPassword(userData.email, userData.password);
    const user = userCredential.user;
    console.log('Usuario creado en Authentication con UID:', user.uid);

    // Configurar permisos según el rol
    configurePermissions(userData);

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
      permissions: userData.permissions,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('Datos guardados exitosamente en Firestore');

    // Mostrar mensaje de éxito
    alert('¡Usuario creado exitosamente!');
    
    // Limpiar formulario y UI
    resetForm();
    
    // Recargar tabla de usuarios
    await loadUsersTable(currentPage);
    
    console.log('=== CREACIÓN DE USUARIO COMPLETADA ===');
    
  } catch (error) {
    console.error('Error al crear usuario:', error);
    let errorMessage = 'Error desconocido';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'El correo electrónico ya está en uso';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Correo electrónico inválido';
        break;
      case 'auth/weak-password':
        errorMessage = 'La contraseña es muy débil';
        break;
      default:
        errorMessage = `${error.code || 'Error'}: ${error.message}`;
    }
    
    alert(`Error al crear usuario: ${errorMessage}`);
  }
}

// Validar datos del usuario
function validateUserData(userData) {
  if (!userData.email) {
    return { valid: false, message: 'El correo electrónico es obligatorio' };
  }
  
  if (!userData.password) {
    return { valid: false, message: 'La contraseña es obligatoria' };
  }
  
  if (userData.password.length < 6) {
    return { valid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
  }
  
  if (!userData.fullName) {
    return { valid: false, message: 'El nombre completo es obligatorio' };
  }
  
  if (!userData.username) {
    return { valid: false, message: 'El nombre de usuario es obligatorio' };
  }
  
  if (!userData.rut) {
    return { valid: false, message: 'El RUT es obligatorio' };
  }
  
  if (!userData.dob) {
    return { valid: false, message: 'La fecha de nacimiento es obligatoria' };
  }
  
  if (!userData.sex) {
    return { valid: false, message: 'El sexo es obligatorio' };
  }
  
  if (!userData.role) {
    return { valid: false, message: 'El rol es obligatorio' };
  }
  
  return { valid: true };
}

// Configurar permisos según el rol
function configurePermissions(userData) {
  if (userData.role === 'administrador') {
    // Administradores tienen todos los permisos
    menus.forEach(menu => {
      userData.permissions.menus[menu] = true;
      if (window.submenus && window.submenus[menu]) {
        window.submenus[menu].forEach(sub => {
          userData.permissions.submenus[`${menu}-${sub.page}`] = true;
          if (menu === 'usuarios' && sub.page === 'crear') {
            Object.keys(createElements).forEach(element => {
              userData.permissions.elements[`usuarios-crear-${createElements[element].id}`] = true;
            });
          }
        });
      }
    });
  } else {
    // Para otros roles, usar permisos seleccionados en el modal
    document.querySelectorAll('.menu-checkbox').forEach(checkbox => {
      const menu = checkbox.getAttribute('data-menu');
      userData.permissions.menus[menu] = checkbox.checked;
    });
    
    document.querySelectorAll('.submenu-checkbox').forEach(checkbox => {
      const submenu = checkbox.getAttribute('data-submenu');
      userData.permissions.submenus[submenu] = checkbox.checked;
    });
    
    document.querySelectorAll('.element-checkbox').forEach(checkbox => {
      const element = checkbox.getAttribute('data-element');
      userData.permissions.elements[element] = checkbox.checked;
    });
  }
}

// Limpiar formulario
function resetForm() {
  const userForm = document.getElementById('userForm');
  if (userForm) {
    userForm.reset();
  }
  
  const permissionsModal = document.getElementById('permissionsModal');
  if (permissionsModal) {
    permissionsModal.style.display = 'none';
  }
  
  loadDefaultPermissions();
}

// Configurar manejadores de eventos
function setupEventHandlers() {
  // Manejar cambio de rol
  const roleSelect = document.getElementById('role');
  if (roleSelect) {
    roleSelect.addEventListener('change', loadDefaultPermissions);
  }

  // Manejar botón de crear usuario
  const createUserBtn = document.getElementById('createUserBtn');
  if (createUserBtn) {
    createUserBtn.addEventListener('click', handleButtonClick);
  }

  // Cerrar el modal
  const closeModal = document.querySelector('.close-modal');
  if (closeModal) {
    closeModal.addEventListener('click', () => {
      console.log('Cerrando modal de permisos');
      document.getElementById('permissionsModal').style.display = 'none';
    });
  }

  // Guardar permisos desde el modal
  const savePermissions = document.getElementById('savePermissions');
  if (savePermissions) {
    savePermissions.addEventListener('click', () => {
      console.log('Guardando permisos desde el modal');
      document.getElementById('permissionsModal').style.display = 'none';
    });
  }

  // Manejar botones de paginación
  const prevPage = document.getElementById('prevPage');
  if (prevPage) {
    prevPage.addEventListener('click', async () => {
      console.log('Clic en Anterior, página actual:', currentPage);
      if (currentPage > 1) {
        await loadUsersTable(currentPage - 1);
      }
    });
  }

  const nextPage = document.getElementById('nextPage');
  if (nextPage) {
    nextPage.addEventListener('click', async () => {
      console.log('Clic en Siguiente, página actual:', currentPage);
      if (db) {
        const usersSnapshot = await db.collection('users').get();
        const totalPages = Math.ceil(usersSnapshot.docs.length / itemsPerPage);
        if (currentPage < totalPages) {
          await loadUsersTable(currentPage + 1);
        }
      }
    });
  }
}

// Cargar datos de usuarios en la tabla con paginación
async function loadUsersTable(page = 1) {
  console.log('Ejecutando loadUsersTable:', page);
  const tableBody = document.getElementById('usersTableBody');
  const pageInfo = document.getElementById('pageInfo');
  const prevButton = document.getElementById('prevPage');
  const nextButton = document.getElementById('nextPage');

  if (!db) {
    console.error('Firestore no está inicializado');
    return;
  }

  try {
    const usersSnapshot = await db.collection('users').get();
    console.log('Usuarios obtenidos:', usersSnapshot.docs.length);
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const totalPages = Math.ceil(users.length / itemsPerPage);
    currentPage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedUsers = users.slice(startIndex, endIndex);

    if (tableBody) {
      tableBody.innerHTML = '';
      paginatedUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.fullName || ''}</td>
          <td>${user.username || ''}</td>
          <td>${user.rut || ''}</td>
          <td>${user.dob || ''}</td>
          <td>${user.email || ''}</td>
          <td>${user.sex ? user.sex.charAt(0).toUpperCase() + user.sex.slice(1) : ''}</td>
          <td>${user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}</td>
        `;
        tableBody.appendChild(row);
      });
    }

    if (pageInfo) {
      pageInfo.textContent = `Página ${currentPage} de ${totalPages || 1}`;
    }
    
    if (prevButton) {
      prevButton.disabled = currentPage === 1;
    }
    
    if (nextButton) {
      nextButton.disabled = currentPage === totalPages || totalPages === 0;
    }
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
    alert(`Error al cargar usuarios: ${error.message}`);
  }
}

// Aplicar permisos al cargar la página
async function applyPermissions() {
  console.log('Ejecutando applyPermissions...');
  if (!auth || !db) {
    console.error('Firebase Auth o Firestore no están inicializados');
    return;
  }
  
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

// Iniciar la carga de scripts de Firebase cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded disparado, iniciando carga de Firebase...');
  loadFirebaseScripts();
});