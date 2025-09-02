const dateElement = document.getElementById('currentDate');
if (dateElement) {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = today.toLocaleDateString('es-ES', options);
} else {
    console.error('Error: No se encontró el elemento #currentDate');
}

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

function loadScript(url) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${url}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.onload = () => {
            resolve();
        };
        script.onerror = () => {
            console.error(`Error al cargar script ${url}`);
            reject(new Error(`No se pudo cargar el script ${url}`));
        };
        document.head.appendChild(script);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMenu);
} else {
    initializeMenu();
}

function initializeMenu() {
    const mainMenu = document.querySelector('.main-menu');
    const submenu = document.querySelector('.submenu');
    const submenuContent = document.querySelector('.submenu-content');
    const backLink = document.querySelector('.back-link');
    const content = document.querySelector('.content');
    const userElement = document.querySelector('.user'); 
    const sidebar = document.querySelector('.sidebar');
    const toggleSidebar = document.getElementById('toggle-sidebar');

    if (!mainMenu || !submenu || !submenuContent || !backLink || !content || !userElement || !sidebar || !toggleSidebar) {
        console.error('Error: No se encontraron uno o más elementos del DOM');
        return;
    }

    // Definir permisos completos sin requerir autenticación
    const permissions = {};
    Object.keys(submenus).forEach(menu => {
        permissions[menu] = {};
        submenus[menu].forEach(item => {
            permissions[menu][item.page] = true;
        });
    });

    userElement.textContent = 'Bienvenido, Usuario';

    function loadSubpage(folder, page, jsFiles) {
        content.innerHTML = '';
        document.querySelectorAll('link[data-subpage], script[data-subpage]').forEach(el => {
            el.remove();
        });

        fetch(`../subpages/${folder}/${page}/${page}.html`)
            .then(response => {
                if (!response.ok) throw new Error('Página no encontrada');
                return response.text();
            })
            .then(data => {
                content.innerHTML = data;

                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = `../subpages/${folder}/${page}/${page}.css`;
                link.dataset.subpage = page;
                document.head.appendChild(link);

                jsFiles.forEach(jsFile => {
                    const scriptSrc = `../subpages/${folder}/${page}/${jsFile}.js`;
                    if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
                        const script = document.createElement('script');
                        script.src = scriptSrc;
                        script.dataset.subpage = page;
                        document.body.appendChild(script);
                    }
                });
            })
            .catch(error => {
                content.innerHTML = '<p>Error al cargar la página</p>';
                console.error('Error al cargar subpágina:', error);
            });
    }

    function renderMenu() {
        mainMenu.innerHTML = Object.keys(submenus)
            .filter(menu => permissions[menu])
            .map(menu => {
                const menuText = menu.charAt(0).toUpperCase() + menu.slice(1).replace('-', ' ');
                return `
                <a href="#" data-submenu="${menu}" title="${menuText}">
                    <i class="fas fa-chevron-right"></i>
                    <span class="menu-text">${menuText}</span>
                </a>
            `;
            }).join('');

        mainMenu.addEventListener('click', (e) => {
            e.preventDefault();
            const link = e.target.closest('a');
            if (!link) return;
            const submenuId = link.getAttribute('data-submenu');
            if (!submenuId || !submenus[submenuId] || !permissions[submenuId]) return;

            const submenuItems = submenus[submenuId].filter(item => permissions[submenuId][item.page]);
            submenuContent.innerHTML = submenuItems.map(item => `
                <a href="#" data-folder="${item.folder}" data-page="${item.page}" data-js-files="${item.jsFiles.join(',')}" title="${item.text}">
                    ${item.text}
                </a>
            `).join('');

            mainMenu.style.display = 'none';
            submenu.style.display = 'block';
        });

        submenuContent.addEventListener('click', (e) => {
            e.preventDefault();
            const link = e.target.closest('a');
            if (!link) return;
            const folder = link.getAttribute('data-folder');
            const page = link.getAttribute('data-page');
            const jsFiles = link.getAttribute('data-js-files').split(',');
            if (folder && page && jsFiles && permissions[folder]?.[page]) {
                loadSubpage(folder, page, jsFiles);
            } else {
                content.innerHTML = '<p>No tienes permiso para acceder a esta página</p>';
            }
        });

        backLink.addEventListener('click', (e) => {
            e.preventDefault();
            submenu.style.display = 'none';
            mainMenu.style.display = 'block';
        });
    }

    renderMenu();

    toggleSidebar.addEventListener('click', (e) => {
        e.preventDefault();
        sidebar.classList.toggle('collapsed');
        const icon = toggleSidebar.querySelector('i');
        if (sidebar.classList.contains('collapsed')) {
            icon.classList.remove('fa-angles-left');
            icon.classList.add('fa-angles-right');
            toggleSidebar.title = 'Expandir menú';
        } else {
            icon.classList.remove('fa-angles-right');
            icon.classList.add('fa-angles-left');
            toggleSidebar.title = 'Contraer menú';
        }
    });
}