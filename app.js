import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, addDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// --- ফিচার ১: ওয়ালেট ও ইউজার ডাটা (Sample) ---
let userBalance = 0;
const balanceDisplay = document.getElementById('balance');
const userNameDisplay = document.getElementById('user-name-display');

// আপাতত ম্যানুয়ালি দেখাচ্ছি, পরে ডাটাবেস থেকে আসবে
userNameDisplay.innerText = "Siyam Gaming";
balanceDisplay.innerText = "100"; 

// --- ফিচার ২: ম্যাচ লিস্ট (Ongoing/Upcoming) ---
const matchList = document.getElementById('match-list');
onSnapshot(collection(db, "matches"), (snapshot) => {
    matchList.innerHTML = ""; 
    snapshot.forEach((doc) => {
        const match = doc.data();
        matchList.innerHTML += `
            <div class="match-card">
                <div class="match-header">
                    <span class="map-tag">📌 ${match.map}</span>
                    <span class="live-tag">${match.status || 'UPCOMING'}</span>
                </div>
                <div class="match-info-grid">
                    <div class="info-item"><label>PRIZE</label><span>৳${match.prize}</span></div>
                    <div class="info-item"><label>ENTRY</label><span>৳${match.fee}</span></div>
                    <div class="info-item"><label>TYPE</label><span>SOLO</span></div>
                </div>
                <button class="join-btn" onclick="joinMatch('${doc.id}', ${match.fee})">JOIN NOW</button>
            </div>
        `;
    });
});

// --- ফিচার ৩: জয়েন সিস্টেম লজিক ---
window.joinMatch = (matchId, fee) => {
    if(userBalance < fee) {
        alert("আপনার ব্যালেন্স কম! দয়া করে টাকা অ্যাড করুন।");
    } else {
        alert("সফলভাবে জয়েন করেছেন! রুম আইডি ম্যাচের ১৫ মিনিট আগে এখানে পাবেন।");
    }
}
