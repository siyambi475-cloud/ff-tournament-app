import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD7G-O9kFFMSBOf1m23gtPKZ677q67xyEY",
  authDomain: "ffrnvm.firebaseapp.com",
  projectId: "ffrnvm",
  storageBucket: "ffrnvm.firebasestorage.app",
  messagingSenderId: "578541384954",
  appId: "1:578541384954:web:a7c20373284014b3244543"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const matchList = document.getElementById('match-list');

// Firestore থেকে সরাসরি তথ্য আনা
onSnapshot(collection(db, "matches"), (snapshot) => {
    matchList.innerHTML = ""; // আগের ডামি কার্ড মুছে ফেলা
    snapshot.forEach((doc) => {
        const match = doc.data();
        matchList.innerHTML += `
            <div class="match-card">
                <div class="match-header">
                    <span class="map">${match.map} - SOLO</span>
                    <span class="status">${match.status || 'OPEN'}</span>
                </div>
                <div class="match-body">
                    <div class="info">Entry: <b>${match.fee} TK</b></div>
                    <div class="info">Prize: <b>${match.prize} TK</b></div>
                </div>
                <button class="join-btn" onclick="alert('Joining: ${match.title}')">JOIN NOW</button>
            </div>
        `;
    });
});
