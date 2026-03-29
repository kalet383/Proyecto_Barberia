import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnXFUb9dWokSw1NW401el2dHYUZj0TTHE",
  authDomain: "barberiaweb-d116e.firebaseapp.com",
  projectId: "barberiaweb-d116e",
  storageBucket: "barberiaweb-d116e.firebasestorage.app",
  messagingSenderId: "7123720182",
  appId: "1:7123720182:web:68dbe4757406f46f4f19d7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };
