
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
  import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
  import { firebaseConfig } from './js/firebase-config.js';

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  const orderProducts = document.querySelector('#checkout-products');
  const totalContainer = document.querySelector('#checkout-total');
  const placeOrderBtn = document.querySelector('#placeOrderBtn');
  const billingInputs = document.querySelectorAll('.billing-details .input');

  function isFormComplete() {
    return Array.from(billingInputs).every(input => input.value.trim() !== '');
  }

  onAuthStateChanged(auth, async (user) => {
    console.log('Current user:', user); 
    if (user) {
      const uid = user.uid;
      const cartRef = collection(db, "carts", uid, "items");
      const snapshot = await getDocs(cartRef);

      let total = 0;
      orderProducts.innerHTML = '';

      snapshot.forEach((doc) => {
        const data = doc.data();
        const itemTotal = data.price * data.quantity;
        total += itemTotal;

        orderProducts.insertAdjacentHTML('beforeend', `
          <div class="order-col">
            <div>${data.quantity}x ${data.name}</div>
            <div>$${itemTotal.toFixed(2)}</div>
          </div>
        `);
      });

      totalContainer.textContent = `$${total.toFixed(2)}`;

      placeOrderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!isFormComplete()) {
          alert("Please complete all billing details.");
          return;
        }
        window.location.href = "order.html";
      });
    } else {
      console.warn("User is not logged in.");
    }
  });
