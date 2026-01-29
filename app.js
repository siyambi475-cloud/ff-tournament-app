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

// ১. ম্যাচ ডাটা রিয়েল-টাইম লোড ও ফিল্টার
function loadMatches(filterStatus = 'UPCOMING') {
    onSnapshot(collection(db, "matches"), (snapshot) => {
        matchList.innerHTML = "";
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.status === filterStatus || (filterStatus === 'UPCOMING' && !data.status)) {
                matchList.innerHTML += `
                    <div class="match-card">
                        <div class="match-header">
                            <span>📌 ${data.map || 'Bermuda'}</span>
                            <span>${data.type || 'SOLO'}</span>
                        </div>
                        <div class="match-body">
                            <h3>${data.title}</h3>
                            <div class="match-grid">
                                <div class="grid-item"><small>PRIZE</small><b>৳${data.prize}</b></div>
                                <div class="grid-item"><small>ENTRY</small><b>৳${data.fee}</b></div>
                                <div class="grid-item"><small>TIME</small><b>${data.time || '9 PM'}</b></div>
                            </div>
                        </div>
                        <button class="join-btn" onclick="alert('Joining Match...')">JOIN NOW</button>
                    </div>`;
            }
        });
    });
}

// ২. সেকশন সুইচিং (Home, Wallet, etc.)
window.showSection = (section) => {
    document.getElementById('home-section').style.display = section === 'home' ? 'block' : 'none';
    document.getElementById('wallet-section').style.display = section === 'wallet' ? 'block' : 'none';
};

// ইনিশিয়াল লোড
loadMatches();
