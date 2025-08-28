console.log('crear.js se ha cargado correctamente');

// Función para cargar un script dinámicamente
function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
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

// Cargar scripts de Firebase y luego inicializar
Promise.all([
    loadScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js'),
    loadScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js')
])
.then(() => {
    try {
        // Inicializar Firebase
        firebase.initializeApp(firebaseConfig);
        // Inicializar Firestore
        const db = firebase.firestore();
        console.log('Firebase se ha inicializado correctamente');
    } catch (error) {
        console.error('Error al inicializar Firebase:', error);
    }
})
.catch(error => {
    console.error('Error al cargar los scripts de Firebase:', error);
});