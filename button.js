const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("productImage");
const previewImg = document.getElementById("previewImg");

uploadBtn.addEventListener("click", (e) => {
  e.preventDefault();
  fileInput.click();
});

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      previewImg.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
});