import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";

// Firebase Config (Replace with your own)
const firebaseConfig = {
    apiKey: "AIzaSyBnjXzGaiueqdtzxP_cSbdiGrVnsbcOG58",
    authDomain: "pledgeit-sdgp.firebaseapp.com",
    projectId: "pledgeit-sdgp",
    storageBucket: "pledgeit-sdgp.firebasestorage.app",
    messagingSenderId: "1034784306704",
    appId: "1:1034784306704:web:7d8443cdabd44541953c95",
    measurementId: "G-94D1SZJZ8R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup, createUserWithEmailAndPassword };
