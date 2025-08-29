console.log('crear.js se ha cargado correctamente');

// Bandera para modo de prueba (sin autenticación), usando namespace para evitar conflictos
window.AppConfig = window.AppConfig || {};
if (!window.AppConfig.hasOwnProperty('TEST_MODE')) {
    window.AppConfig.TEST_MODE = true; // Valor por defecto
}
console.log('TEST_MODE definido como:', window.AppConfig.TEST_MODE);

// Función para cargar un script dinámicamente
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
            reject(new Error(`No se pudo cargar el script ${url}`));
        };
        document.head.appendChild(script);
    });
}

// Configuración de Firebase
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
    console.log('firebaseConfig definido');
} else {
    console.log('firebaseConfig ya estaba definido');
}

// Verificar si el DOM está listo
if (document.readyState === 'loading') {
    console.log('DOM aún cargando, esperando DOMContentLoaded');
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    console.log('DOM ya cargado, inicializando app');
    initializeApp();
}

function initializeApp() {
    console.log('Iniciando aplicación');
    // Cargar scripts de Firebase solo si no está en modo de prueba
    const firebasePromise = window.AppConfig.TEST_MODE ? Promise.resolve() : Promise.all([
        loadScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js'),
        loadScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js'),
        loadScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js')
    ]);

    firebasePromise.then(() => {
        console.log(window.AppConfig.TEST_MODE ? 'Modo de prueba activo, Firebase no inicializado' : 'Scripts de Firebase cargados correctamente');
        let db, auth;
        if (!window.AppConfig.TEST_MODE) {
            if (!firebase.apps.length) {
                firebase.initializeApp(window.firebaseConfig);
                console.log('Firebase se ha inicializado correctamente');
            } else {
                console.log('Firebase ya estaba inicializado');
            }
            db = firebase.firestore();
            auth = firebase.auth();
            console.log('Firestore y Auth inicializados');
        }

        // Estructura de submenús y elementos
        const submenus = {
            usuarios: [
                {
                    text: 'Crear',
                    page: 'crear',
                    folder: 'usuarios',
                    jsFiles: ['crear'],
                    elements: [
                        {
                            id: 'form',
                            text: 'Formulario',
                            permissionKey: 'form',
                            fields: [
                                { id: 'fullName', text: 'Nombre Completo', permissionKey: 'field-fullName' },
                                { id: 'username', text: 'Nombre de Usuario', permissionKey: 'field-username' },
                                { id: 'rut', text: 'RUT', permissionKey: 'field-rut' },
                                { id: 'dob', text: 'Fecha de Nacimiento', permissionKey: 'field-dob' },
                                { id: 'email', text: 'Correo Electrónico', permissionKey: 'field-email' },
                                { id: 'password', text: 'Contraseña', permissionKey: 'field-password' },
                                { id: 'sex', text: 'Sexo', permissionKey: 'field-sex' },
                                { id: 'role', text: 'Rol', permissionKey: 'field-role' },
                                { id: 'submit-button', text: 'Botón Crear', permissionKey: 'submit-button' }
                            ]
                        },
                        {
                            id: 'table',
                            text: 'Tabla',
                            permissionKey: 'table',
                            columns: [
                                { id: 'fullName', text: 'Nombre Completo', permissionKey: 'column-fullName' },
                                { id: 'username', text: 'Nombre de Usuario', permissionKey: 'column-username' },
                                { id: 'rut', text: 'RUT', permissionKey: 'column-rut' },
                                { id: 'dob', text: 'Fecha de Nacimiento', permissionKey: 'column-dob' },
                                { id: 'email', text: 'Correo Electrónico', permissionKey: 'column-email' },
                                { id: 'sex', text: 'Sexo', permissionKey: 'column-sex' },
                                { id: 'role', text: 'Rol', permissionKey: 'column-role' }
                            ]
                        }
                    ]
                },
                { text: 'Editar', page: 'editar', folder: 'usuarios', jsFiles: ['editar'] }
            ],
            implantes: [
                { text: 'Ingresos', page: 'ingresos', folder: 'implantes', jsFiles: ['ingresos'] },
                { text: 'Cargar', page: 'cargar', folder: 'implantes', jsFiles: ['cargar'] }
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
        const usersTableSection = document.querySelector('.users-table-section');
        const usersTableBody = document.getElementById('usersTableBody');
        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');
        const pageInfo = document.getElementById('pageInfo');

        // Verificar elementos del DOM
        if (!roleSelect || !permissionsModal || !permissionsTree || !closeModal ||
            !savePermissionsBtn || !userForm || !createUserBtn || !usersTableSection ||
            !usersTableBody || !prevPageBtn || !nextPageBtn || !pageInfo) {
            console.error('Error: No se encontraron uno o más elementos del DOM');
            return;
        }
        console.log('Todos los elementos del DOM encontrados correctamente');

        // Variable para permisos seleccionados
        let selectedPermissions = {};

        // Función para generar permisos completos para administrador
        function generateFullPermissions() {
            console.log('Generando permisos completos para administrador');
            const fullPermissions = {};
            Object.keys(submenus).forEach(menu => {
                fullPermissions[menu] = {};
                submenus[menu].forEach(submenu => {
                    fullPermissions[menu][submenu.page] = {};
                    if (submenu.elements) {
                        submenu.elements.forEach(element => {
                            if (element.fields) {
                                fullPermissions[menu][submenu.page][element.permissionKey] = {
                                    enabled: true,
                                    fields: element.fields.map(field => field.permissionKey)
                                };
                            } else if (element.columns) {
                                fullPermissions[menu][submenu.page][element.permissionKey] = {
                                    enabled: true,
                                    columns: element.columns.map(column => column.permissionKey)
                                };
                            } else {
                                fullPermissions[menu][submenu.page][element.permissionKey] = true;
                            }
                        });
                    }
                });
            });
            console.log('Permisos completos generados:', JSON.stringify(fullPermissions, null, 2));
            return fullPermissions;
        }

        // Generar árbol de permisos
        function generatePermissionsTree() {
            console.log('Generando árbol de permisos');
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
                            <div class="submenu-item">
                                <label>
                                    <input type="checkbox" class="submenu-checkbox" data-menu="${menu}" data-submenu="${submenu.page}">
                                    ${submenu.text}
                                </label>
                                ${submenu.elements ? `
                                    <div class="elements-group" style="display: none;">
                                        ${submenu.elements.map(element => `
                                            <div class="element-item">
                                                <label>
                                                    <input type="checkbox" class="element-checkbox" data-menu="${menu}" data-submenu="${submenu.page}" data-element="${element.permissionKey}">
                                                    ${element.text}
                                                </label>
                                                ${element.fields ? `
                                                    <div class="fields-group" style="display: none;">
                                                        ${element.fields.map(field => `
                                                            <label>
                                                                <input type="checkbox" class="field-checkbox" data-menu="${menu}" data-submenu="${submenu.page}" data-element="${element.permissionKey}" data-field="${field.permissionKey}">
                                                                ${field.text}
                                                            </label>
                                                        `).join('')}
                                                    </div>
                                                ` : ''}
                                                ${element.columns ? `
                                                    <div class="columns-group" style="display: none;">
                                                        ${element.columns.map(column => `
                                                            <label>
                                                                <input type="checkbox" class="column-checkbox" data-menu="${menu}" data-submenu="${submenu.page}" data-element="${element.permissionKey}" data-column="${column.permissionKey}">
                                                                ${column.text}
                                                            </label>
                                                        `).join('')}
                                                    </div>
                                                ` : ''}
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                `;
                permissionsTree.appendChild(menuDiv);
            });

            // Manejar eventos de cambio en el árbol de permisos
            permissionsTree.addEventListener('change', (e) => {
                console.log('Evento change disparado en permissionsTree');
                if (e.target.classList.contains('menu-checkbox')) {
                    const menu = e.target.dataset.menu;
                    console.log(`Checkbox de menú "${menu}" cambiado, checked: ${e.target.checked}`);
                    const permissionGroup = e.target.closest('.permission-group');
                    const submenuGroup = permissionGroup.querySelector('.submenu-group');
                    if (submenuGroup) {
                        submenuGroup.style.display = e.target.checked ? 'block' : 'none';
                        if (!e.target.checked) {
                            submenuGroup.querySelectorAll('.submenu-checkbox').forEach(checkbox => {
                                checkbox.checked = false;
                                delete selectedPermissions[menu];
                                submenuGroup.querySelectorAll('.elements-group').forEach(group => {
                                    group.style.display = 'none';
                                    group.querySelectorAll('.element-checkbox').forEach(el => el.checked = false);
                                    group.querySelectorAll('.fields-group, .columns-group').forEach(subgroup => {
                                        subgroup.style.display = 'none';
                                        subgroup.querySelectorAll('.field-checkbox, .column-checkbox').forEach(subCheckbox => subCheckbox.checked = false);
                                    });
                                });
                            });
                            console.log('Submenús y elementos deseleccionados para', menu);
                        }
                    }
                }

                if (e.target.classList.contains('submenu-checkbox')) {
                    const menu = e.target.dataset.menu;
                    const submenu = e.target.dataset.submenu;
                    console.log(`Checkbox de submenú "${submenu}" cambiado, checked: ${e.target.checked}`);
                    const submenuItem = e.target.closest('.submenu-item');
                    const elementsGroup = submenuItem.querySelector('.elements-group');
                    if (elementsGroup) {
                        elementsGroup.style.display = e.target.checked ? 'block' : 'none';
                        if (!e.target.checked) {
                            elementsGroup.querySelectorAll('.element-checkbox').forEach(checkbox => {
                                checkbox.checked = false;
                                if (selectedPermissions[menu]?.[submenu]) {
                                    delete selectedPermissions[menu][submenu];
                                }
                                elementsGroup.querySelectorAll('.fields-group, .columns-group').forEach(subgroup => {
                                    subgroup.style.display = 'none';
                                    subgroup.querySelectorAll('.field-checkbox, .column-checkbox').forEach(subCheckbox => subCheckbox.checked = false);
                                });
                            });
                        }
                    }
                    if (e.target.checked) {
                        if (!selectedPermissions[menu]) selectedPermissions[menu] = {};
                        if (!selectedPermissions[menu][submenu]) selectedPermissions[menu][submenu] = {};
                    } else if (selectedPermissions[menu]?.[submenu]) {
                        delete selectedPermissions[menu][submenu];
                        if (Object.keys(selectedPermissions[menu]).length === 0) delete selectedPermissions[menu];
                    }
                    console.log('Permisos seleccionados actualizados:', JSON.stringify(selectedPermissions, null, 2));
                }

                if (e.target.classList.contains('element-checkbox')) {
                    const menu = e.target.dataset.menu;
                    const submenu = e.target.dataset.submenu;
                    const element = e.target.dataset.element;
                    console.log(`Checkbox de elemento "${element}" cambiado, checked: ${e.target.checked}`);
                    const elementItem = e.target.closest('.element-item');
                    const fieldsGroup = elementItem.querySelector('.fields-group');
                    const columnsGroup = elementItem.querySelector('.columns-group');
                    if (fieldsGroup) fieldsGroup.style.display = e.target.checked ? 'block' : 'none';
                    if (columnsGroup) columnsGroup.style.display = e.target.checked ? 'block' : 'none';
                    if (!e.target.checked) {
                        if (fieldsGroup) fieldsGroup.querySelectorAll('.field-checkbox').forEach(checkbox => checkbox.checked = false);
                        if (columnsGroup) columnsGroup.querySelectorAll('.column-checkbox').forEach(checkbox => checkbox.checked = false);
                    }
                    if (e.target.checked) {
                        if (!selectedPermissions[menu]) selectedPermissions[menu] = {};
                        if (!selectedPermissions[menu][submenu]) selectedPermissions[menu][submenu] = {};
                        selectedPermissions[menu][submenu][element] = element === 'table' ? { enabled: true, columns: [] } : element === 'form' ? { enabled: true, fields: [] } : true;
                    } else if (selectedPermissions[menu]?.[submenu]?.[element]) {
                        delete selectedPermissions[menu][submenu][element];
                        if (Object.keys(selectedPermissions[menu][submenu]).length === 0) delete selectedPermissions[menu][submenu];
                        if (Object.keys(selectedPermissions[menu]).length === 0) delete selectedPermissions[menu];
                    }
                    console.log('Permisos seleccionados actualizados:', JSON.stringify(selectedPermissions, null, 2));
                }

                if (e.target.classList.contains('field-checkbox')) {
                    const menu = e.target.dataset.menu;
                    const submenu = e.target.dataset.submenu;
                    const element = e.target.dataset.element;
                    const field = e.target.dataset.field;
                    console.log(`Checkbox de campo "${field}" cambiado, checked: ${e.target.checked}`);
                    if (e.target.checked) {
                        if (!selectedPermissions[menu]) selectedPermissions[menu] = {};
                        if (!selectedPermissions[menu][submenu]) selectedPermissions[menu][submenu] = {};
                        if (!selectedPermissions[menu][submenu][element]) selectedPermissions[menu][submenu][element] = { enabled: true, fields: [] };
                        if (!selectedPermissions[menu][submenu][element].fields.includes(field)) {
                            selectedPermissions[menu][submenu][element].fields.push(field);
                        }
                    } else if (selectedPermissions[menu]?.[submenu]?.[element]?.fields) {
                        selectedPermissions[menu][submenu][element].fields = selectedPermissions[menu][submenu][element].fields.filter(f => f !== field);
                        if (selectedPermissions[menu][submenu][element].fields.length === 0 && !selectedPermissions[menu][submenu][element].columns) {
                            delete selectedPermissions[menu][submenu][element];
                        }
                        if (Object.keys(selectedPermissions[menu][submenu]).length === 0) delete selectedPermissions[menu][submenu];
                        if (Object.keys(selectedPermissions[menu]).length === 0) delete selectedPermissions[menu];
                    }
                    console.log('Permisos seleccionados actualizados:', JSON.stringify(selectedPermissions, null, 2));
                }

                if (e.target.classList.contains('column-checkbox')) {
                    const menu = e.target.dataset.menu;
                    const submenu = e.target.dataset.submenu;
                    const element = e.target.dataset.element;
                    const column = e.target.dataset.column;
                    console.log(`Checkbox de columna "${column}" cambiado, checked: ${e.target.checked}`);
                    if (e.target.checked) {
                        if (!selectedPermissions[menu]) selectedPermissions[menu] = {};
                        if (!selectedPermissions[menu][submenu]) selectedPermissions[menu][submenu] = {};
                        if (!selectedPermissions[menu][submenu][element]) selectedPermissions[menu][submenu][element] = { enabled: true, columns: [] };
                        if (!selectedPermissions[menu][submenu][element].columns.includes(column)) {
                            selectedPermissions[menu][submenu][element].columns.push(column);
                        }
                    } else if (selectedPermissions[menu]?.[submenu]?.[element]?.columns) {
                        selectedPermissions[menu][submenu][element].columns = selectedPermissions[menu][submenu][element].columns.filter(c => c !== column);
                        if (selectedPermissions[menu][submenu][element].columns.length === 0 && !selectedPermissions[menu][submenu][element].fields) {
                            delete selectedPermissions[menu][submenu][element];
                        }
                        if (Object.keys(selectedPermissions[menu][submenu]).length === 0) delete selectedPermissions[menu][submenu];
                        if (Object.keys(selectedPermissions[menu]).length === 0) delete selectedPermissions[menu];
                    }
                    console.log('Permisos seleccionados actualizados:', JSON.stringify(selectedPermissions, null, 2));
                }
            });
        }

        // Mostrar el modal o asignar permisos completos según el rol
        roleSelect.addEventListener('change', (e) => {
            console.log('Evento change disparado en roleSelect, valor:', e.target.value);
            if (e.target.value === 'administrador') {
                console.log('Rol administrador seleccionado, asignando permisos completos');
                selectedPermissions = generateFullPermissions();
                permissionsModal.style.display = 'none';
            } else if (e.target.value === 'operador' || e.target.value === 'gestor') {
                console.log('Mostrando modal de permisos para operador o gestor');
                permissionsModal.style.display = 'flex';
                generatePermissionsTree();
            } else {
                console.log('Ocultando modal de permisos');
                permissionsModal.style.display = 'none';
                selectedPermissions = {};
                console.log('Permisos limpiados:', selectedPermissions);
            }
        });

        // Cerrar el modal
        closeModal.addEventListener('click', () => {
            console.log('Cerrando modal');
            permissionsModal.style.display = 'none';
        });

        // Guardar permisos y cerrar el modal
        savePermissionsBtn.addEventListener('click', () => {
            console.log('Permisos guardados:', JSON.stringify(selectedPermissions, null, 2));
            permissionsModal.style.display = 'none';
        });

        // Crear usuario
        createUserBtn.addEventListener('click', async () => {
            console.log('Botón Crear Usuario clickeado');
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

            if (!userData.fullName || !userData.username || !userData.rut || !userData.dob ||
                !userData.email || !userData.password || !userData.sex || !userData.role) {
                console.log('Campos incompletos, mostrando alerta');
                alert('Por favor, completa todos los campos.');
                return;
            }

            if (window.AppConfig.TEST_MODE) {
                console.log('Modo de prueba: Simulando creación de usuario', userData);
                alert('Usuario simulado creado: ' + JSON.stringify(userData, null, 2));
                userForm.reset();
                selectedPermissions = {};
                loadUsers();
                return;
            }

            try {
                console.log('Creando usuario en Firebase Auth:', userData.email);
                const userCredential = await auth.createUserWithEmailAndPassword(userData.email, userData.password);
                console.log('Usuario creado en Auth:', userCredential.user.uid);
                delete userData.password;
                userData.uid = userCredential.user.uid;
                console.log('Guardando usuario en Firestore:', userData);
                await db.collection('users').doc(userData.uid).set(userData);
                console.log('Usuario creado exitosamente en Firestore');
                userForm.reset();
                selectedPermissions = {};
                console.log('Formulario reseteado, permisos limpiados');
                loadUsers();
            } catch (error) {
                console.error('Error al crear usuario:', error);
                alert('Error al crear usuario: ' + error.message);
            }
        });

        // Paginación
        let currentPage = 1;
        const usersPerPage = 10;
        let users = [];

        async function loadUsers() {
            try {
                if (window.AppConfig.TEST_MODE) {
                    console.log('Modo de prueba: Simulando carga de usuarios');
                    users = [
                        { id: 'test1', fullName: 'Usuario Test 1', username: 'user1', rut: '12345678-9', dob: '1990-01-01', email: 'user1@test.com', sex: 'masculino', role: 'administrador' },
                        { id: 'test2', fullName: 'Usuario Test 2', username: 'user2', rut: '98765432-1', dob: '1995-01-01', email: 'user2@test.com', sex: 'femenino', role: 'operador' }
                    ];
                    console.log('Usuarios simulados cargados:', users.length);
                } else {
                    console.log('Cargando usuarios desde Firestore');
                    const snapshot = await db.collection('users').get();
                    users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    console.log('Usuarios cargados:', users.length);
                }
                renderUsers();
            } catch (error) {
                console.error('Error al cargar usuarios:', error);
            }
        }

        function renderUsers() {
            console.log('Renderizando usuarios, página:', currentPage);
            const userPermissions = window.AppConfig.TEST_MODE ? simulatePermissions() : getCurrentUserPermissions();
            const allowedColumns = userPermissions?.usuarios?.crear?.table?.columns || [
                'column-fullName', 'column-username', 'column-rut', 'column-dob',
                'column-email', 'column-sex', 'column-role'
            ];

            const start = (currentPage - 1) * usersPerPage;
            const end = start + usersPerPage;
            const paginatedUsers = users.slice(start, end);

            usersTableBody.innerHTML = paginatedUsers.map(user => `
                <tr>
                    ${allowedColumns.includes('column-fullName') ? `<td>${user.fullName}</td>` : ''}
                    ${allowedColumns.includes('column-username') ? `<td>${user.username}</td>` : ''}
                    ${allowedColumns.includes('column-rut') ? `<td>${user.rut}</td>` : ''}
                    ${allowedColumns.includes('column-dob') ? `<td>${user.dob}</td>` : ''}
                    ${allowedColumns.includes('column-email') ? `<td>${user.email}</td>` : ''}
                    ${allowedColumns.includes('column-sex') ? `<td>${user.sex}</td>` : ''}
                    ${allowedColumns.includes('column-role') ? `<td>${user.role}</td>` : ''}
                </tr>
            `).join('');

            pageInfo.textContent = `Página ${currentPage} de ${Math.ceil(users.length / usersPerPage)}`;
            prevPageBtn.disabled = currentPage === 1;
            nextPageBtn.disabled = end >= users.length;
            console.log('Tabla de usuarios actualizada');
        }

        prevPageBtn.addEventListener('click', () => {
            console.log('Botón Anterior clickeado');
            if (currentPage > 1) {
                currentPage--;
                renderUsers();
            }
        });

        nextPageBtn.addEventListener('click', () => {
            console.log('Botón Siguiente clickeado');
            if (currentPage < Math.ceil(users.length / usersPerPage)) {
                currentPage++;
                renderUsers();
            }
        });

        // Simular permisos para modo de prueba
        function simulatePermissions() {
            console.log('Simulando permisos para modo de prueba');
            return {
                usuarios: {
                    crear: {
                        form: {
                            enabled: true,
                            fields: [
                                'field-fullName',
                                'field-username',
                                'field-rut',
                                'field-dob',
                                'field-email',
                                'field-password',
                                'field-sex',
                                'field-role',
                                'submit-button'
                            ]
                        },
                        table: {
                            enabled: true,
                            columns: [
                                'column-fullName',
                                'column-username',
                                'column-rut',
                                'column-dob',
                                'column-email',
                                'column-sex',
                                'column-role'
                            ]
                        }
                    }
                }
            };
        }

        // Obtener permisos del usuario actual
        async function getCurrentUserPermissions() {
            if (window.AppConfig.TEST_MODE) {
                console.log('Modo de prueba: Retornando permisos simulados');
                return simulatePermissions();
            }
            console.log('Obteniendo permisos del usuario actual');
            const user = auth.currentUser;
            if (!user) {
                console.log('No hay usuario autenticado');
                return {};
            }
            try {
                const doc = await db.collection('users').doc(user.uid).get();
                if (doc.exists) {
                    const permissions = doc.data().permissions || {};
                    console.log('Permisos del usuario:', JSON.stringify(permissions, null, 2));
                    return permissions;
                } else {
                    console.log('No se encontraron datos del usuario');
                    return {};
                }
            } catch (error) {
                console.error('Error al obtener permisos:', error);
                return {};
            }
        }

        // Aplicar permisos al cargar la página
        async function applyPermissions() {
            console.log('Aplicando permisos al cargar la página');
            const userPermissions = await getCurrentUserPermissions();
            const hasFormAccess = userPermissions?.usuarios?.crear?.form?.enabled;
            const allowedFields = userPermissions?.usuarios?.crear?.form?.fields || [];
            const hasTableAccess = userPermissions?.usuarios?.crear?.table?.enabled;
            const allowedColumns = userPermissions?.usuarios?.crear?.table?.columns || [];

            if (!hasFormAccess) {
                console.log('Ocultando formulario por falta de permisos');
                userForm.style.display = 'none';
            } else {
                console.log('Aplicando permisos a campos del formulario:', allowedFields);
                document.querySelectorAll('.form-group').forEach(group => {
                    const fieldKey = group.dataset.permission;
                    if (!allowedFields.includes(fieldKey)) {
                        console.log(`Ocultando campo ${fieldKey}`);
                        group.style.display = 'none';
                    }
                });
            }

            if (!hasTableAccess) {
                console.log('Ocultando tabla por falta de permisos');
                usersTableSection.style.display = 'none';
            } else {
                console.log('Aplicando permisos a columnas de la tabla:', allowedColumns);
                document.querySelectorAll('#usersTable th').forEach(header => {
                    const columnKey = header.dataset.permission;
                    if (!allowedColumns.includes(columnKey)) {
                        console.log(`Ocultando columna ${columnKey}`);
                        header.style.display = 'none';
                    }
                });
            }
        }

        // Cargar usuarios y aplicar permisos al iniciar
        if (window.AppConfig.TEST_MODE) {
            console.log('Modo de prueba: Cargando usuarios y aplicando permisos simulados');
            loadUsers();
            applyPermissions();
        } else {
            auth.onAuthStateChanged(user => {
                if (user) {
                    console.log('Usuario autenticado:', user.uid);
                    loadUsers();
                    applyPermissions();
                } else {
                    console.log('No hay usuario autenticado');
                    document.querySelector('.content').innerHTML = '<p>Inicia sesión para continuar</p>';
                }
            });
        }
    })
    .catch(error => {
        console.error('Error al cargar scripts de Firebase:', error);
        alert('No se pudieron cargar los scripts de Firebase');
    });
}