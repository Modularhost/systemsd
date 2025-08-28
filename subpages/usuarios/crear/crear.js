import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

console.log('crear.js has been loaded successfully');

const firebaseConfig = {
    apiKey: "AIzaSyB_LByv2DPTs2298UEHSD7cFKZN6L8gtls",
    authDomain: "systemsd-b4678.firebaseapp.com",
    projectId: "systemsd-b4678",
    storageBucket: "systemsd-b4678.firebasestorage.app",
    messagingSenderId: "116607414952",
    appId: "1:116607414952:web:31a7e3f47711844b95889d",
    measurementId: "G-C8V7X0RGH5"
};

try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log('Firebase has been initialized successfully');
} catch (error) {
    console.error('Error initializing Firebase:', error);
}