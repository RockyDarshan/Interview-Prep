// Import the functions you need from the SDKs you need
import { initializeApp ,getApp,getApps} from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';



const firebaseConfig = {
  apiKey: "AIzaSyD-ZzuXxdSLF7EQHVNHVq2f9yW9A6zrdkA",
  authDomain: "interview-prep-a5099.firebaseapp.com",
  projectId: "interview-prep-a5099",
  storageBucket: "interview-prep-a5099.firebasestorage.app",
  messagingSenderId: "1076475220059",
  appId: "1:1076475220059:web:a163fa09ba7c58cb2f2f7e",
  measurementId: "G-X6MM33TGMT"
};

// Initialize Firebase
const app =!getApps.length ? initializeApp(firebaseConfig):getApp(); 
export const auth = getAuth(app);
export const db = getFirestore(app);
