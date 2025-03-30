"use strict";

import { Product } from "./types.js";
import {
  loadProducts as loadProductsFromStorage,
  saveProducts as saveProductsToStorage,
} from "./storage.js";
import { showSuccessModal } from "./modal.js";

let products: Product[] = [];
let editingProductId: string | null = null;
let isEditMode: boolean = false;

document.addEventListener("DOMContentLoaded", () => {
  // Load products using storage.ts
  products = loadProductsFromStorage();

  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode");
  const id = urlParams.get("id");
  if (mode === "edit" && id) {
    isEditMode = true;
    editingProductId = id;
    const product = products.find((p) => p.id === editingProductId);
    if (product) {
      const headerEl = document.getElementById("pageHeader");
      if (headerEl) headerEl.textContent = "Edit Product";

      const nameInput = document.getElementById(
        "productName"
      ) as HTMLInputElement;
      const priceInput = document.getElementById(
        "productPrice"
      ) as HTMLInputElement;
      const descriptionInput = document.getElementById("productDescription") as
        | HTMLInputElement
        | HTMLTextAreaElement;
      const imagePreview = document.getElementById(
        "imagePreview"
      ) as HTMLImageElement;
      if (nameInput) nameInput.value = product.name;
      if (priceInput) priceInput.value = product.price;
      if (descriptionInput) descriptionInput.value = product.description;
      if (imagePreview) imagePreview.src = product.image;
    }
  }

  const productForm = document.getElementById("productForm");
  if (productForm) {
    productForm.addEventListener("submit", handleFormSubmit);
  }
  const productImage = document.getElementById("productImage");
  if (productImage) {
    productImage.addEventListener("change", previewImage);
  }
  setupLiveValidation();
});

function saveProducts(): void {
  saveProductsToStorage(products);
}

function handleFormSubmit(e: Event): void {
  e.preventDefault();
  const nameEl = document.getElementById("productName") as HTMLInputElement;
  const priceEl = document.getElementById("productPrice") as HTMLInputElement;
  const descriptionEl = document.getElementById("productDescription") as
    | HTMLInputElement
    | HTMLTextAreaElement;
  const imageEl = document.getElementById("productImage") as HTMLInputElement;
  let isValid = true;

  // Validate name
  if (!nameEl.value.trim() || nameEl.value.trim().length < 2) {
    nameEl.classList.add("is-invalid");
    isValid = false;
  } else {
    nameEl.classList.remove("is-invalid");
  }

  // Validate price
  if (
    !priceEl.value.trim() ||
    isNaN(Number(priceEl.value)) ||
    Number(priceEl.value) <= 0
  ) {
    priceEl.classList.add("is-invalid");
    isValid = false;
  } else {
    priceEl.classList.remove("is-invalid");
  }

  // Validate description
  if (!descriptionEl.value.trim() || descriptionEl.value.trim().length < 10) {
    descriptionEl.classList.add("is-invalid");
    isValid = false;
  } else {
    descriptionEl.classList.remove("is-invalid");
  }

  // Validate image
  const file = imageEl.files ? imageEl.files[0] : undefined;
  if (!isEditMode && !file) {
    imageEl.classList.add("is-invalid");
    isValid = false;
  } else if (file && (!file.type.startsWith("image/") || file.size > 1048576)) {
    imageEl.classList.add("is-invalid");
    isValid = false;
  } else {
    imageEl.classList.remove("is-invalid");
  }

  if (!isValid) return;

  const nameValue = nameEl.value.trim();
  const priceValue = priceEl.value.trim();
  const descriptionValue = descriptionEl.value.trim();

  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const result = event.target?.result;
      if (typeof result === "string") {
        saveProduct(nameValue, result, priceValue, descriptionValue);
      }
    };
    reader.readAsDataURL(file);
  } else if (editingProductId) {
    const existingProduct = products.find((p) => p.id === editingProductId);
    if (existingProduct) {
      saveProduct(
        nameValue,
        existingProduct.image,
        priceValue,
        descriptionValue
      );
    }
  }
}

function saveProduct(
  name: string,
  image: string,
  price: string,
  description: string
): void {
  if (editingProductId) {
    const index = products.findIndex((p) => p.id === editingProductId);
    if (index !== -1) {
      products[index] = {
        id: editingProductId,
        name,
        image,
        price,
        description,
      };
    }
  } else {
    products.push({
      id: Date.now().toString(),
      name,
      image,
      price,
      description,
    });
  }
  saveProducts();
  const message = editingProductId
    ? "Product updated successfully!"
    : "Product added successfully!";
  showSuccessModal(message, true);
}

function previewImage(event: Event): void {
  const input = event.target as HTMLInputElement;
  const file = input.files ? input.files[0] : undefined;
  if (file && file.size > 1048576) {
    alert("Image file size should not exceed 1MB.");
    input.value = "";
    const imagePreview = document.getElementById(
      "imagePreview"
    ) as HTMLImageElement;
    if (imagePreview) {
      imagePreview.src =
        "https://placehold.co/300x300?text=Product+Image&font=roboto";
    }
    return;
  }
  const reader = new FileReader();
  reader.onload = function () {
    const imagePreview = document.getElementById(
      "imagePreview"
    ) as HTMLImageElement;
    if (imagePreview) {
      imagePreview.src = reader.result as string;
    }
  };
  if (file) {
    reader.readAsDataURL(file);
  }
}

function setupLiveValidation(): void {
  const nameEl = document.getElementById("productName") as HTMLInputElement;
  const priceEl = document.getElementById("productPrice") as HTMLInputElement;
  const descriptionEl = document.getElementById("productDescription") as
    | HTMLInputElement
    | HTMLTextAreaElement;
  const imageEl = document.getElementById("productImage") as HTMLInputElement;

  nameEl.addEventListener("input", () => {
    const value = nameEl.value.trim();
    nameEl.classList.toggle("is-invalid", value.length < 2);
  });
  priceEl.addEventListener("input", () => {
    const value = parseFloat(priceEl.value);
    priceEl.classList.toggle("is-invalid", isNaN(value) || value <= 0);
  });
  descriptionEl.addEventListener("input", () => {
    const value = descriptionEl.value.trim();
    descriptionEl.classList.toggle("is-invalid", value.length < 10);
  });
  imageEl.addEventListener("change", () => {
    const file = imageEl.files ? imageEl.files[0] : undefined;
    const isAddMode = !window.location.search.includes("edit");
    if (!file && isAddMode) {
      imageEl.classList.add("is-invalid");
    } else if (
      file &&
      (!file.type.startsWith("image/") || file.size > 1048576)
    ) {
      imageEl.classList.add("is-invalid");
    } else {
      imageEl.classList.remove("is-invalid");
    }
  });
}

export {};
