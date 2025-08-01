// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyByQQtnV5O-FSAY5G35PoyH-T4v-ZLZV3w",
  authDomain: "schoop-fd722.firebaseapp.com",
  projectId: "schoop-fd722",
  storageBucket: "schoop-fd722.appspot.com",
  messagingSenderId: "758236740946",
  appId: "1:758236740946:web:656d5b3fbfa56e38830e8b",
  measurementId: "G-FHLRS323LV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

