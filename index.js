
import { db } from './firebase-config.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

export async function renderProductsByType(type) {
  const container = document.getElementById("product-container");
  if (!container) return;

  const q = query(collection(db, "products"), where("type", "==", type));
  const snapshot = await getDocs(q);

  container.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();
    const productHTML = `
      <div class="product" data-name="${data.name}" data-price="${data.price}" data-img="${data.image}">
        <div class="product-img">
          <img src="${data.image}" alt="">
          <div class="product-label">
            <span class="sale">-30%</span>
            <span class="new">NEW</span>
          </div>
        </div>
        <div class="product-body">
          <p class="product-category">Category</p>
          <h3 class="product-name"><a href="#">${data.name}</a></h3>
          <h4 class="product-price">$${parseFloat(data.price).toFixed(2)} <del class="product-old-price">$990.00</del></h4>
          <div class="product-rating">
            <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i>
          </div>
          <div class="product-btns">
            <button class="add-to-wishlist"><i class="fa fa-heart-o"></i><span class="tooltipp">add to wishlist</span></button>
            <button class="add-to-compare"><i class="fa fa-exchange"></i><span class="tooltipp">add to compare</span></button>
            <button class="quick-view"><i class="fa fa-eye"></i><span class="tooltipp">quick view</span></button>
          </div>
        </div>
        <div class="add-to-cart">
          <button class="add-to-cart-btn"><i class="fa fa-shopping-cart"></i> add to cart</button>
        </div>
      </div>`;
    container.innerHTML += productHTML;
  });
}
