import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc, getDoc, setDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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
const provider = new GoogleAuthProvider();

// লগইন চেক
onAuthStateChanged(auth, async (user) => {
    if (user) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app-ui').style.display = 'block';
        updateBalance(user.uid);
        window.loadMatches('UPCOMING');
    } else {
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('app-ui').style.display = 'none';
    }
});

// গুগল লগইন
document.getElementById('google-login-btn').onclick = () => signInWithPopup(auth, provider);

// ব্যালেন্স আপডেট
async function updateBalance(uid) {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
        const bal = userDoc.data().balance || 0;
        document.getElementById('balance').innerText = bal;
        document.getElementById('wallet-balance').innerText = bal;
    } else {
        await setDoc(doc(db, "users", uid), { balance: 0 });
    }
}

// ম্যাচ লোড
window.loadMatches = (status) => {
    onSnapshot(collection(db, "matches"), (snap) => {
        const list = document.getElementById('match-list');
        list.innerHTML = "";
        snap.forEach(d => {
            const m = d.data();
            if(m.status === status) {
                list.innerHTML += `
                <div class="match-card">
                    <div class="match-header"><span>${m.map}</span><span>${status}</span></div>
                    <div class="match-body">
                        <h3>${m.title}</h3>
                        <div class="info-grid">
                            <div class="info-item">PRIZE<br><b>৳${m.prize}</b></div>
                            <div class="info-item">ENTRY<br><b>৳${m.fee}</b></div>
                            <div class="info-item">TYPE<br><b>SOLO</b></div>
                        </div>
                    </div>
                    <button class="join-btn" onclick="alert('Join logic in next update!')">JOIN NOW</button>
                </div>`;
            }
        });
    });
}

// সেকশন সুইচ
window.showSection = (s) => {
    document.getElementById('home-section').style.display = s === 'home' ? 'block' : 'none';
    document.getElementById('wallet-section').style.display = s === 'wallet' ? 'block' : 'none';
}

// পেমেন্ট সাবমিট
window.submitPayment = async () => {
    const amt = document.getElementById('pay-amount').value;
    const trx = document.getElementById('pay-trxid').value;
    if(amt && trx) {
        await addDoc(collection(db, "payments"), { uid: auth.currentUser.uid, amount: amt, trxid: trx, status: "PENDING" });
        alert("Request Sent!");
    }
}
