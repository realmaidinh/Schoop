import { storage, db } from './firebase-config.js';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const uploadBtn = document.getElementById('uploadBtn');
const imageInput = document.getElementById('productImage');
const addToShopBtn = document.getElementById('addToShopBtn');

let uploadedFile = null;

uploadBtn.addEventListener('click', (e) => {
  e.preventDefault();
  imageInput.click();
});

imageInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    uploadedFile = file;
    const reader = new FileReader();
    reader.onload = function (e) {
      const preview = document.getElementById('preview-image');
      preview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

addToShopBtn.addEventListener('click', async () => {
  const name = document.getElementById('productName').value.trim();
  const price = document.getElementById('productPrice').value.trim();
  const type = document.getElementById('productType').value;

  if (!name || !price || !uploadedFile) {
    alert("Please enter all fields and upload an image.");
    return;
  }

  try {
    const storageRef = ref(storage, `product_images/${Date.now()}_${uploadedFile.name}`);
    await uploadBytes(storageRef, uploadedFile);
    const imageUrl = await getDownloadURL(storageRef);

    await addDoc(collection(db, "products"), {
      name,
      price: parseFloat(price),
      type,
      image: imageUrl,
      createdAt: serverTimestamp()
    });

    alert("✅ Product added successfully!");
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    uploadedFile = null;
    document.getElementById('preview-image').src = './img/product01.png';
  } catch (error) {
    console.error("Upload failed:", error);
    alert("❌ Failed to upload product.");
  }
});
