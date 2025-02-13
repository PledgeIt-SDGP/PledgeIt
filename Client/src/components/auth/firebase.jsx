import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDXDK7ZN_kFBffO5fUvMdEAm_D5MMNFNO0",
    authDomain: "pledgeit-2f5d3.firebaseapp.com",
    projectId: "pledgeit-2f5d3",
    storageBucket: "pledgeit-2f5d3.appspot.com",
    messagingSenderId: "341902020218",
    appId: "1:341902020218:web:a495ba4303926bc148b5c3",
    measurementId: "G-WR6YE8XZ9Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
