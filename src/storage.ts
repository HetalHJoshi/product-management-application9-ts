export function loadProducts(): any[] {
  const stored: string | null = localStorage.getItem("products");
  return stored ? JSON.parse(stored) : [];
}

export function saveProducts(products: any[]): void {
  localStorage.setItem("products", JSON.stringify(products));
}
