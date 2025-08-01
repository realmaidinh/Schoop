import { auth, db } from './firebase-config.js';
import {
  collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, increment
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const cartList = document.querySelector('.cart-list');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const cartQty = document.getElementById('cartQty');


async function renderCart(user) {
  const itemsRef = collection(db, 'carts', user.uid, 'items');
  const snapshot = await getDocs(itemsRef);
  let total = 0;
  let count = 0;
  cartList.innerHTML = '';

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const subtotal = data.price * data.quantity;
    total += subtotal;
    count += data.quantity;

    const widget = document.createElement('div');
    widget.className = 'product-widget';
    widget.innerHTML = `
      <div class="product-img">
        <img src="${data.img}" alt="">
      </div>
      <div class="product-body">
        <h3 class="product-name">${data.name}</h3>
        <h4 class="product-price"><span class="qty">${data.quantity}x</span>$${data.price.toFixed(2)}</h4>
      </div>
      <button class="delete" data-id="${docSnap.id}"><i class="fa fa-close"></i></button>
    `;
    cartList.appendChild(widget);
  });

  cartTotal.innerHTML = `SUBTOTAL: $${total.toFixed(2)}`;
  cartCount.innerText = `${count} Item(s) selected`;
  cartQty.innerText = count;


  cartList.querySelectorAll('.delete').forEach(btn => {
    btn.onclick = async () => {
      await deleteDoc(doc(db, 'carts', user.uid, 'items', btn.dataset.id));
      renderCart(user); 
    };
  });
}

onAuthStateChanged(auth, (user) => {
  if (!user) return;
  renderCart(user);


  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const productEl = btn.closest('.product');
      const name = productEl.dataset.name;
      const price = parseFloat(productEl.dataset.price);
      const img = productEl.dataset.img;

      const itemRef = doc(db, 'carts', user.uid, 'items', name);

      const existing = await getDoc(itemRef);
      if (existing.exists()) {
        await updateDoc(itemRef, { quantity: increment(1) });
      } else {
        await setDoc(itemRef, {
          name,
          price,
          quantity: 1,
          img
        });
        alert("✅ Added to cart successfully!");
      }

      renderCart(user);
    });
  });
});