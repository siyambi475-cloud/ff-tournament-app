import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc, addDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// Slider Logic
onSnapshot(collection(db, "slider"), (snap) => {
    const slider = document.getElementById('main-slider');
    slider.innerHTML = "";
    snap.forEach(d => slider.innerHTML += `<img src="${d.data().url}" class="slide-img">`);
});

// Navigation Functions
window.openMatches = (mode) => {
    currentMode = mode;
    document.getElementById('home-section').style.display = 'none';
    document.getElementById('match-screen').style.display = 'block';
    filterByStatus('UPCOMING');
};

window.backToHome = () => {
    document.getElementById('home-section').style.display = 'block';
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
                let roomInfo = m.roomId ? `<div class="room-box">ID: ${m.roomId} | PASS: ${m.roomPass}</div>` : "";
                list.innerHTML += `
                <div class="match-card">
                    <div class="match-top"><h3>${m.title}</h3></div>
                    ${roomInfo}
                    <div class="match-meta">
                        <div class="meta-item">PRIZE<b>৳${m.prize}</b></div>
                        <div class="meta-item">ENTRY<b>৳${m.fee}</b></div>
                        <div class="meta-item">MAP<b>${m.map}</b></div>
                    </div>
                    <button class="join-btn" onclick="alert('Joining Match...')">JOIN NOW</button>
                </div>`;
            }
        });
    });
};

window.showSection = (s) => {
    document.getElementById('home-section').style.display = 'none';
    document.getElementById('match-screen').style.display = 'none';
    document.getElementById('wallet-section').style.display = 'block';
};

window.toggleWallet = (t) => {
    document.getElementById('dep-form').style.display = t === 'DEP' ? 'block' : 'none';
    document.getElementById('wit-form').style.display = t === 'WIT' ? 'block' : 'none';
};

window.submitDeposit = async () => {
    const amt = document.getElementById('pay-amount').value;
    const trx = document.getElementById('pay-trxid').value;
    if(amt && trx) {
        await addDoc(collection(db, "payments"), { amount: amt, trxid: trx, status: "PENDING", type: "DEPOSIT" });
        alert("Deposit Request Sent!");
    }
};

window.submitWithdraw = async () => {
    const amt = document.getElementById('wit-amount').value;
    const num = document.getElementById('wit-number').value;
    if(amt && num) {
        await addDoc(collection(db, "payments"), { amount: amt, number: num, status: "PENDING", type: "WITHDRAW" });
        alert("Withdraw Request Sent!");
    }
};
