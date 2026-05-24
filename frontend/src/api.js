const BASE_URL = "http://localhost:8000";

export async function fetchProducts() {
  const res = await fetch(`${BASE_URL}/api/products/`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchListings() {
  const res = await fetch(`${BASE_URL}/api/listings/`);
  if (!res.ok) throw new Error("Failed to fetch listings");
  return res.json();
}

export async function fetchOrders() {
  const res = await fetch(`${BASE_URL}/api/orders/`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function createOrder(data) {
  const res = await fetch(`${BASE_URL}/api/orders/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json;
}