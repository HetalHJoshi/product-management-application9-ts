export function loadProducts() {
    const stored = localStorage.getItem("products");
    return stored ? JSON.parse(stored) : [];
}
export function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
}
