
const firebaseConfig = {

    apiKey: "AIzaSyAazSZpWjSy9GnQrRNFUIW6PkstklRgFQo",

    authDomain: "events-e4d36.firebaseapp.com",

    databaseURL: "https://events-e4d36-default-rtdb.europe-west1.firebasedatabase.app",

    projectId: "events-e4d36",

    storageBucket: "events-e4d36.appspot.com",

    messagingSenderId: "399674652161",

    appId: "1:399674652161:web:3d9274f3947cd32fccb200",

    measurementId: "G-5R62RBP5S4"

  };


// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
console.log('Firebase App initialized:', app);

// Initialize Firebase Analytics (Optional, only if you're using Firebase Analytics)

// Initialize Firebase Realtime Database
const db = firebase.database();
console.log('Firebase Realtime Database initialized:', db);