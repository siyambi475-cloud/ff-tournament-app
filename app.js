import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc, getDoc, updateDoc, addDoc, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// ইউজার আইডি (বাস্তব ক্ষেত্রে এটি লগইন থেকে আসবে)
const userId = "USER_001"; 

// ডাটা লোড করা
onSnapshot(doc(db, "users", userId), (d) => {
    if(d.exists()){
        const data = d.data();
        document.getElementById('u-balance').innerText = data.balance;
        document.getElementById('w-amt').innerText = data.balance;
        document.getElementById('u-name').innerText = data.name;
    }
});

onSnapshot(doc(db, "settings", "app"), (d) => {
    if(d.exists()) document.getElementById('admin-num').innerText = d.data().number;
});

onSnapshot(collection(db, "slider"), (snap) => {
    const slider = document.getElementById('main-slider');
    slider.innerHTML = "";
    snap.forEach(d => slider.innerHTML += `<img src="${d.data().url}" class="slide-img">`);
});

window.openMatches = (mode) => {
    onSnapshot(collection(db, "matches"), (snap) => {
        const list = document.getElementById('match-list');
        list.innerHTML = "";
        snap.forEach(async (d) => {
            const m = d.data();
            if(m.mode === mode) {
                // চেক: ইউজার কি জয়েন করেছে?
                let roomHtml = `<div class="locked-room">Locked: Join to see Room ID</div>`;
                
                // যদি রুম আইডি অ্যাডমিন দিয়ে থাকে তবেই শো করবে
                if(m.roomId && m.roomPass) {
                   roomHtml = `<div class="room-box">ID: ${m.roomId} | PASS: ${m.roomPass}</div>`;
                }

                list.innerHTML += `<div class="match-card">
                    <div style="padding:15px; text-align:center;"><h3>${m.title}</h3></div>
                    ${roomHtml}
                    <div style="display:flex; justify-content:space-around; padding:10px; background:#0d141f; font-size:14px;">
                        <span>Prize: ৳${m.prize}</span><span>Fee: ৳${m.fee}</span><span>Map: ${m.map}</span>
                    </div>
                    <button class="join-btn" onclick="joinMatch('${d.id}', ${m.fee})">JOIN NOW</button>
                </div>`;
            }
        });
    });
};

window.joinMatch = async (matchId, fee) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.data().balance >= fee) {
        await updateDoc(userRef, { balance: userSnap.data().balance - fee });
        await addDoc(collection(db, "match_joiners"), {
            matchId, uid: userId, playerName: userSnap.data().name, time: Date.now()
        });
        alert("Joined Successfully!");
    } else { alert("টাকা নেই! আগে অ্যাড করুন।"); }
};

window.sendDeposit = async () => {
    const amt = document.getElementById('d-amt').value;
    const trx = document.getElementById('d-trx').value;
    if(amt && trx) {
        await addDoc(collection(db, "payments"), { uid: userId, amount: Number(amt), trxid: trx, type: "DEPOSIT", status: "PENDING" });
        alert("Deposit request sent!");
    }
};

window.sendWithdraw = async () => {
    const amt = Number(document.getElementById('w-amt-in').value);
    const num = document.getElementById('w-num').value;
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if(userSnap.data().balance >= amt && amt >= 100) {
        await updateDoc(userRef, { balance: userSnap.data().balance - amt });
        await addDoc(collection(db, "payments"), { uid: userId, amount: amt, number: num, type: "WITHDRAW", status: "PENDING" });
        alert("Withdraw request sent! Balance locked.");
    } else { alert("Insufficient Balance!"); }
};

window.showScreen = (s) => {
    document.getElementById('home-view').style.display = s === 'home' ? 'block' : 'none';
    document.getElementById('wallet-view').style.display = s === 'wallet' ? 'block' : 'none';
};

window.payMode = (m) => {
    document.getElementById('dep-form').style.display = m === 'DEP' ? 'block' : 'none';
    document.getElementById('wit-form').style.display = m === 'WIT' ? 'block' : 'none';
    }
