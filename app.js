import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc, getDoc, setDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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
const auth = getAuth(app);

// Authentication
window.handleAuth = (type) => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    if(type === 'REGISTER') createUserWithEmailAndPassword(auth, email, pass).catch(e => alert(e.message));
    else signInWithEmailAndPassword(auth, email, pass).catch(e => alert("Wrong Credentials!"));
};

onAuthStateChanged(auth, async (user) => {
    if (user) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app-ui').style.display = 'block';
        updateBalance(user.uid);
        window.loadMatches('UPCOMING');
        listenNoti();
    } else {
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('app-ui').style.display = 'none';
    }
});

window.signOutUser = () => signOut(auth);

// Wallet Update
async function updateBalance(uid) {
    onSnapshot(doc(db, "users", uid), (doc) => {
        if (doc.exists()) {
            const b = doc.data().balance || 0;
            document.getElementById('balance').innerText = b;
            document.getElementById('wallet-balance').innerText = b;
        } else { setDoc(doc(db, "users", uid), { balance: 0 }); }
    });
}

// Notification Listener
function listenNoti() {
    onSnapshot(collection(db, "notifications"), (snap) => {
        const bar = document.getElementById('noti-bar');
        const text = document.getElementById('noti-text');
        snap.forEach(d => {
            const data = d.data();
            if(data.active) { bar.style.display = 'block'; text.innerText = data.message; }
            else { bar.style.display = 'none'; }
        });
    });
}

// Match Loader
window.loadMatches = (status) => {
    onSnapshot(collection(db, "matches"), (snap) => {
        const list = document.getElementById('match-list');
        list.innerHTML = "";
        snap.forEach(d => {
            const m = d.data();
            if(m.status === status) {
                list.innerHTML += `<div class="match-card">
                    <div class="match-header"><span>${m.map}</span><span>${status}</span></div>
                    <div class="match-body"><h3>${m.title}</h3>
                    <div class="info-grid"><div class="info-item">PRIZE<b>৳${m.prize}</b></div><div class="info-item">ENTRY<b>৳${m.fee}</b></div><div class="info-item">SOLO</div></div></div>
                    <button class="join-btn" onclick="alert('Join logic in progress!')">JOIN NOW</button></div>`;
            }
        });
    });
};

window.showSection = (s) => {
    document.getElementById('home-section').style.display = s === 'home' ? 'block' : 'none';
    document.getElementById('wallet-section').style.display = s === 'wallet' ? 'block' : 'none';
};

window.submitPayment = async () => {
    const amt = document.getElementById('pay-amount').value;
    const trx = document.getElementById('pay-trxid').value;
    if(amt && trx) {
        await addDoc(collection(db, "payments"), { uid: auth.currentUser.uid, amount: amt, trxid: trx, status: "PENDING" });
        alert("Payment Sent to Admin!");
    }
};
