import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD7G-O9kFFMSBOf1m23gtPKZ677q67xyEY",
  authDomain: "ffrnvm.firebaseapp.com",
  projectId: "ffrnvm",
  storageBucket: "ffrnvm.firebasestorage.app",
  messagingSenderId: "578541384954",
  appId: "1:578541384954:web:a7c20373284014b3244543",
  measurementId: "G-H8MXRKSRRS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Firebase Connected Successfully!");

// ভবিষ্যতে এখান থেকেই আমরা টুর্নামেন্ট ডাটা লোড করবো।
