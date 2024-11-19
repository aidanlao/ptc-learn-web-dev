// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbhokoWmnrOIXyK_WVgKxC6GxrI4XOVqE",
  authDomain: "ptc-learn-web-dev.firebaseapp.com",
  projectId: "ptc-learn-web-dev",
  storageBucket: "ptc-learn-web-dev.firebasestorage.app",
  messagingSenderId: "647232999895",
  appId: "1:647232999895:web:23e3805dd9c9105f4dbb92",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore, Auth, and Storage
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // Firebase Storage

// Export the Firebase services for use in your app
export { auth, db, storage };
