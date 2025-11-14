// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBViOUHU5GfckHOo6VLBYpgJ5zRhlKLRQA",
  authDomain: "artykuly-dd3cb.firebaseapp.com",
  projectId: "artykuly-dd3cb",
  storageBucket: "artykuly-dd3cb.firebasestorage.app",
  messagingSenderId: "601737555728",
  appId: "1:601737555728:web:65f9f30a32e22d3b607f95",
  measurementId: "G-G8K1EPT2L3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);
export const projectId = firebaseConfig.projectId;

export { db };
