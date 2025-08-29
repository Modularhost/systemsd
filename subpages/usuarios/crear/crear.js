console.log('crear.js se ha cargado correctamente');

// Función para cargar un script dinámicamente solo si no está ya cargado
function loadScript(url) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${url}"]`)) {
            console.log(`Script ${url} ya está cargado`);
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.onload = () => {
            console.log(`Script ${url} cargado correctamente`);
            resolve();
        };
        script.onerror = () => {
            console.error(`Error al cargar script ${url}`);
            reject();
        };
        document.head.appendChild(script);
    });
}

// Configuración de Firebase (proteger contra redeclaración)
if (typeof firebaseConfig === 'undefined') {
    window.firebaseConfig = {
        apiKey: "AIzaSyB_LByv2DPTs2298UEHSD7cFKZN6L8gtls",
        authDomain: "systemsd-b4678.firebaseapp.com",
        projectId: "systemsd-b4678",
        storageBucket: "systemsd-b4678.firebasestorage.app",
        messagingSenderId: "116607414952",
        appId: "1:116607414952:web:31a7e3f47711844b95889d",
        measurementId: "G-C8V7X0RGH5"
    };
}

// Cargar scripts de Firebase y luego inicializar
Promise.all([
    loadScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js'),
    loadScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js')
])
.then(() => {
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(window.firebaseConfig);
            console.log('Firebase se ha inicializado correctamente');
        } else {
            console.log('Firebase ya estaba inicializado');
        }
        const db = firebase.firestore();

        // Estructura de submenús (copiada de menu.js para generar los permisos)
        const submenus = {
            implantes: [
                { text: 'Ingresos', page: 'ingresos', folder: 'implantes', jsFiles: ['ingresos'] },
                { text: 'Cargar', page: 'cargar', folder: 'implantes', jsFiles: ['cargar'] },
                { text: 'Pacientes', page: 'pacientes', folder: 'implantes', jsFiles: ['pacientes'] },
                { text: 'Referencias', page: 'referencias', folder: 'implantes', jsFiles: ['referencias'] }
            ],
            consignacion: [
                { text: 'Registro', page: 'registro', folder: 'consignacion', jsFiles: ['registro'] },
                { text: 'Seguimiento', page: 'seguimiento', folder: 'consignacion', jsFiles: ['seguimiento'] },
                { text: 'Reportes', page: 'reportes', folder: 'consignacion', jsFiles: ['reportes'] }
            ],
            historico: [
                { text: 'Consultas', page: 'consultas', folder: 'historico', jsFiles: ['consultas'] },
                { text: 'Archivos', page: 'archivos', folder: 'historico', jsFiles: ['archivos'] }
            ],
            laboratorio: [
                { text: 'Análisis', page: 'analisis', folder: 'laboratorio', jsFiles: ['analisis'] },
                { text: 'Resultados', page: 'resultados', folder: 'laboratorio', jsFiles: ['resultados'] }
            ],
            visualizador: [
                { text: 'Gráficos', page: 'graficos', folder: 'visualizador', jsFiles: ['graficos'] },
                { text: 'Imágenes', page: 'imagenes', folder: 'visualizador', jsFiles: ['imagenes'] }
            ],
            prestacion: [
                { text: 'Empresas', page: 'empresas', folder: 'prestacion', jsFiles: ['empresas'] },
                { text: 'Médicos', page: 'medicos', folder: 'prestacion', jsFiles: ['medicos'] },
                { text: 'Areas', page: 'areas', folder: 'prestacion', jsFiles: ['areas'] }
            ],
            herramientas: [
                { text: 'Utilidades', page: 'utilidades', folder: 'herramientas', jsFiles: ['utilidades'] },
                { text: 'Configuración', page: 'configuracion-herramientas', folder: 'herramientas', jsFiles: ['configuracion-herramientas'] }
            ],
            importacion: [
                { text: 'Carga Masiva', page: 'carga-masiva', folder: 'importacion', jsFiles: ['carga-masiva'] },
                { text: 'Validación', page: 'validacion', folder: 'importacion', jsFiles: ['validacion'] }
            ],
            apuntes: [
                { text: 'Notas', page: 'notas', folder: 'apuntes', jsFiles: ['notas'] },
                { text: 'Recordatorios', page: 'recordatorios', folder: 'apuntes', jsFiles: ['recordatorios'] }
            ],
            migracion: [
                { text: 'Transferencia', page: 'transferencia', folder: 'migracion', jsFiles: ['transferencia'] },
                { text: 'Sincronización', page: 'sincronizacion', folder: 'migracion', jsFiles: ['sincronizacion'] }
            ],
            dashboard: [
                { text: 'Resumen', page: 'resumen', folder: 'dashboard', jsFiles: ['resumen'] },
                { text: 'Estadísticas', page: 'estadisticas', folder: 'dashboard', jsFiles: ['estadisticas'] }
            ],
            archivos: [
                { text: 'Subir', page: 'subir', folder: 'archivos', jsFiles: ['subir'] },
                { text: 'Gestionar', page: 'gestionar', folder: 'archivos', jsFiles: ['gestionar'] }
            ],
            usuarios: [
                { text: 'Crear', page: 'crear', folder: 'usuarios', jsFiles: ['crear'] },
                { text: 'Editar', page: 'editar', folder: 'usuarios', jsFiles: ['editar'] }
            ],
            configuracion: [
                { text: 'Sistema', page: 'sistema', folder: 'configuracion', jsFiles: ['sistema'] },
                { text: 'Preferencias', page: 'preferencias', folder: 'configuracion', jsFiles: ['preferencias'] }
            ],
            'cerrar-sesion': [
                { text: 'Confirmar', page: 'confirmar-cerrar-sesion', folder: 'cerrar-sesion', jsFiles: ['confirmar-cerrar-sesion'] }
            ]
        };

        // Referencias al DOM
        const roleSelect = document.getElementById('role');
        const permissionsModal = document.getElementById('permissionsModal');
        const permissionsTree = document.getElementById('permissionsTree');
        const closeModal = document.querySelector('.close-modal');
        const savePermissionsBtn = document.getElementById('savePermissions');
        const userForm = document.getElementById('userForm');
        const createUserBtn = document.getElementById('createUserBtn');
        const usersTableBody = document.getElementById('usersTableBody');
        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');
        const pageInfo = document.getElementById('pageInfo');

        // Variable para almacenar los permisos seleccionados
        let selectedPermissions = {};

        // Función para generar los checkboxes de permisos
        function generatePermissionsTree() {
            permissionsTree.innerHTML = '';
            Object.keys(submenus).forEach(menu => {
                const menuDiv = document.createElement('div');
                menuDiv.className = 'permission-group';
                menuDiv.innerHTML = `
                    <label>
                        <input type="checkbox" class="menu-checkbox" data-menu="${menu}">
                        ${menu.charAt(0).toUpperCase() + menu.slice(1).replace('-', ' ')}
                    </label>
                    <div class="submenu-group" style="display: none;">
                        ${submenus[menu].map(submenu => `
                            <label>
                                <input type="checkbox" class="submenu-checkbox" data-menu="${menu}" data-submenu="${submenu.page}">
                                ${submenu.text}
                            </label>
                        `).join('')}
                    </div>
                `;
                permissionsTree.appendChild(menuDiv);
            });

            // Mostrar submenús al seleccionar un menú
            permissionsTree.addEventListener('change', (e) => {
                if (e.target.classList.contains('menu-checkbox')) {
                    const menu = e.target.dataset.menu;
                    const submenuGroup = e.target.nextElementSibling;
                    submenuGroup.style.display = e.target.checked ? 'block' : 'none';

                    // Si se deselecciona un menú, deseleccionar todos sus submenús
                    if (!e.target.checked) {
                        submenuGroup.querySelectorAll('.submenu-checkbox').forEach(checkbox => {
                            checkbox.checked = false;
                            if (selectedPermissions[menu]) {
                                delete selectedPermissions[menu];
                            }
                        });
                    }
                }

                // Actualizar permisos seleccionados
                if (e.target.classList.contains('submenu-checkbox')) {
                    const menu = e.target.dataset.menu;
                    const submenu = e.target.dataset.submenu;
                    if (!selectedPermissions[menu]) {
                        selectedPermissions[menu] = [];
                    }
                    if (e.target.checked) {
                        if (!selectedPermissions[menu].includes(submenu)) {
                            selectedPermissions[menu].push(submenu);
                        }
                    } else {
                        selectedPermissions[menu] = selectedPermissions[menu].filter(s => s !== submenu);
                        if (selectedPermissions[menu].length === 0) {
                            delete selectedPermissions[menu];
                        }
                    }
                }
            });
        }

        // Mostrar el modal cuando se selecciona "Operador" o "Gestor"
        roleSelect.addEventListener('change', (e) => {
            if (e.target.value === 'operador' || e.target.value === 'gestor') {
                permissionsModal.style.display = 'flex';
                generatePermissionsTree();
            } else {
                permissionsModal.style.display = 'none';
                selectedPermissions = {}; // Limpiar permisos si se selecciona otro rol
            }
        });

        // Cerrar el modal
        closeModal.addEventListener('click', () => {
            permissionsModal.style.display = 'none';
        });

        // Guardar permisos y cerrar el modal
        savePermissionsBtn.addEventListener('click', () => {
            console.log('Permisos seleccionados:', selectedPermissions);
            permissionsModal.style.display = 'none';
        });

        // Crear usuario y guardar en Firestore
        createUserBtn.addEventListener('click', async () => {
            const userData = {
                fullName: document.getElementById('fullName').value,
                username: document.getElementById('username').value,
                rut: document.getElementById('rut').value,
                dob: document.getElementById('dob').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                sex: document.getElementById('sex').value,
                role: roleSelect.value,
                permissions: selectedPermissions
            };

            // Validar que todos los campos estén completos
            if (!userData.fullName || !userData.username || !userData.rut || !userData.dob ||
                !userData.email || !userData.password || !userData.sex || !userData.role) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            try {
                await db.collection('users').add(userData);
                console.log('Usuario creado exitosamente');
                userForm.reset();
                selectedPermissions = {};
                loadUsers(); // Actualizar la tabla
            } catch (error) {
                console.error('Error al crear usuario:', error);
                alert('Error al crear usuario. Por favor, intenta de nuevo.');
            }
        });

        // Paginación
        let currentPage = 1;
        const usersPerPage = 10;
        let users = [];

        async function loadUsers() {
            try {
                const snapshot = await db.collection('users').get();
                users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                renderUsers();
            } catch (error) {
                console.error('Error al cargar usuarios:', error);
            }
        }

        function renderUsers() {
            const start = (currentPage - 1) * usersPerPage;
            const end = start + usersPerPage;
            const paginatedUsers = users.slice(start, end);

            usersTableBody.innerHTML = paginatedUsers.map(user => `
                <tr>
                    <td>${user.fullName}</td>
                    <td>${user.username}</td>
                    <td>${user.rut}</td>
                    <td>${user.dob}</td>
                    <td>${user.email}</td>
                    <td>${user.sex}</td>
                    <td>${user.role}</td>
                </tr>
            `).join('');

            pageInfo.textContent = `Página ${currentPage} de ${Math.ceil(users.length / usersPerPage)}`;
            prevPageBtn.disabled = currentPage === 1;
            nextPageBtn.disabled = end >= users.length;
        }

        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderUsers();
            }
        });

        nextPageBtn.addEventListener('click', () => {
            if (currentPage < Math.ceil(users.length / usersPerPage)) {
                currentPage++;
                renderUsers();
            }
        });

        // Cargar usuarios al iniciar
        loadUsers();

    } catch (error) {
        console.error('Error al inicializar Firebase:', error);
    }
})
.catch(error => {
    console.error('Error al cargar los scripts de Firebase:', error);
});