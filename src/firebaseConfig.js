import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBY-Mx0hstoVBxfx8P1FGyVfKPYBmqNyeQ",
  authDomain: "employee-management-ce713.firebaseapp.com",
  projectId: "employee-management-ce713",
  storageBucket: "employee-management-ce713.firebasestorage.app",
  messagingSenderId: "451344737403",
  appId: "1:451344737403:web:1114bda84e9e6dc6316ede",
  measurementId: "G-0PL2PJKBEB",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
