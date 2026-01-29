import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

let currentMode = "";
let currentStatus = "UPCOMING";

window.openMatches = (mode) => {
    currentMode = mode;
    document.getElementById('category-screen').style.display = 'none';
    document.getElementById('match-screen').style.display = 'block';
    filterByStatus('UPCOMING');
};

window.backToHome = () => {
    document.getElementById('category-screen').style.display = 'block';
    document.getElementById('match-screen').style.display = 'none';
    document.getElementById('wallet-section').style.display = 'none';
};

window.filterByStatus = (status) => {
    currentStatus = status;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + status).classList.add('active');
    
    onSnapshot(collection(db, "matches"), (snap) => {
        const list = document.getElementById('match-list');
        list.innerHTML = "";
        snap.forEach(d => {
            const m = d.data();
            if(m.mode === currentMode && m.status === currentStatus) {
                list.innerHTML += `
                <div class="match-card">
                    <div class="match-banner"><h3>${m.title}</h3></div>
                    <div class="match-meta">
                        <div class="meta-item">PRIZE<b>৳${m.prize}</b></div>
                        <div class="meta-item">ENTRY<b>৳${m.fee}</b></div>
                        <div class="meta-item">MAP<b>${m.map}</b></div>
                    </div>
                    <button class="join-btn" onclick="alert('Join Logic Ready!')">JOIN NOW</button>
                </div>`;
            }
        });
    });
};

window.showSection = (s) => {
    document.getElementById('category-screen').style.display = 'none';
    document.getElementById('match-screen').style.display = 'none';
    document.getElementById('wallet-section').style.display = 'block';
};
