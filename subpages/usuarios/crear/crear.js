console.log('crear.js se ha cargado correctamente');

// Función para cargar un script dinámicamente solo si no está ya cargado
function loadScript(url) {
    return new Promise((resolve, reject) => {
        // Verificar si el script ya está en el DOM
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
        // Inicializar Firebase solo si no está inicializado
        if (!firebase.apps.length) {
            firebase.initializeApp(window.firebaseConfig);
            console.log('Firebase se ha inicializado correctamente');
        } else {
            console.log('Firebase ya estaba inicializado');
        }
        // Inicializar Firestore
        const db = firebase.firestore();
        // Aquí puedes agregar el resto de la lógica para interactuar con Firestore
    } catch (error) {
        console.error('Error al inicializar Firebase:', error);
    }
})
.catch(error => {
    console.error('Error al cargar los scripts de Firebase:', error);
});