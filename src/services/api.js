const API_BASE_URL = "http://127.0.0.1:5050/api";

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

export async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/products`);
  return handleResponse(response);
}

export async function getFeaturedProducts() {
  const response = await fetch(`${API_BASE_URL}/products/featured`);
  return handleResponse(response);
}

export async function getProductById(id) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  return handleResponse(response);
}

export async function createOrder(orderData) {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  return handleResponse(response);
}

export async function getOrders() {
  const response = await fetch(`${API_BASE_URL}/orders`);
  return handleResponse(response);
}

export async function updateOrderStatus(orderId, status) {
  const response = await fetch(
    `${API_BASE_URL}/orders/${orderId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  return handleResponse(response);
}
