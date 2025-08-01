import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const accountIcon = document.getElementById('accountIcon');
const accountDropdown = document.getElementById('accountDropdown');
const userEmail = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    const role = docSnap.exists() ? docSnap.data().role : "Member";

    accountIcon.addEventListener('mouseenter', () => {
      accountDropdown.style.display = 'block';
    });
    accountDropdown.addEventListener('mouseleave', () => {
      accountDropdown.style.display = 'none';
    });

    if (userEmail) userEmail.innerText = user.email;

    if (role === "admin") {
      const dashboardBtn = document.createElement("a");
      dashboardBtn.href = "dashboard.html";
      dashboardBtn.className = "btn btn-info btn-sm";
      dashboardBtn.textContent = "Dashboard";
      dashboardBtn.style.display = "block";
      dashboardBtn.style.marginTop = "10px";

      if (logoutBtn && !document.getElementById("dashboardLink")) {
        dashboardBtn.id = "dashboardLink";
        accountDropdown.insertBefore(dashboardBtn, logoutBtn);
      }
    }

  } else {
    accountIcon.href = "login.html";
    accountDropdown.style.display = "none";
  }
});


if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signOut(auth)
      .then(() => {
        localStorage.removeItem("user");
        window.location.href = "login.html";
      })
      .catch((err) => {
        console.error("Đăng xuất lỗi:", err);
      });
  });
}
