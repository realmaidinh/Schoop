import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

import {
  doc, setDoc, getDoc
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

console.log("✅ login.js loaded");

const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

loginBtn.onclick = () => {
  loginBtn.classList.add('active');
  signupBtn.classList.remove('active');
  loginForm.classList.remove('hidden');
  signupForm.classList.add('hidden');
};

signupBtn.onclick = () => {
  signupBtn.classList.add('active');
  loginBtn.classList.remove('active');
  signupForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
};

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    const userDoc = await getDoc(doc(db, "users", uid));
    const role = userDoc.exists() ? userDoc.data().role : "Member";

    localStorage.setItem("user", JSON.stringify({ email, role }));

    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
});

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;

  if (password !== confirmPassword) {
    alert('❌ Passwords do not match!');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const role = email === "Admin@gmail.com" ? "admin" : "Member";

    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: userCredential.user.email,
      role
    });

    alert('✅ Signup success!');
    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
});
