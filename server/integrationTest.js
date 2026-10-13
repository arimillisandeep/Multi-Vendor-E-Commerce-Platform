/**
 * Integration Test Script for Multi-Vendor E-Commerce Platform
 * Run with: node server/integrationTest.js
 * Server must be running on port 5000
 */

const http = require("http");

let customerToken, sellerToken, adminToken;
let productId, categoryId, orderId, reviewId;

function apiRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: "localhost",
      port: 5000,
      path: "/api" + path,
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...(data ? { "Content-Length": Buffer.byteLength(data) } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
    const req = http.request(options, (res) => {
      let responseBody = "";
      res.on("data", (chunk) => (responseBody += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(responseBody);
          resolve({ status: res.statusCode, data: json, token: json.data?.token });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseBody, token: null });
        }
      });
    });
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log("\n=== Multi-Vendor E-Commerce Integration Tests ===\n");

  const ts = Date.now();
  const adminEmail = `admin${ts}@test.com`;
  const sellerEmail = `seller${ts}@test.com`;
  const customerEmail = `customer${ts}@test.com`;

  let res, pass = 0, fail = 0;
  const log = (name, success, status, msg = "") => {
    console.log(`${success ? "" : ""} | ${name} | ${status} | ${msg}`);
    if (success) pass++; else fail++;
  };

  // Register users
  res = await apiRequest("POST", "/auth/register", { name: "Test Admin", email: adminEmail, password: "password123", role: "admin" });
  adminToken = res.token;
  log("Register Admin", res.data.status === "success", res.status);

  res = await apiRequest("POST", "/auth/register", { name: "Test Seller", email: sellerEmail, password: "password123", role: "seller" });
  sellerToken = res.token;
  log("Register Seller", res.data.status === "success", res.status);

  res = await apiRequest("POST", "/auth/register", { name: "Test Customer", email: customerEmail, password: "password123", role: "customer" });
  customerToken = res.token;
  log("Register Customer", res.data.status === "success", res.status);

  // Duplicate registration
  res = await apiRequest("POST", "/auth/register", { name: "Test", email: customerEmail, password: "password123", role: "customer" });
  log("Register Duplicate", res.status === 400, res.status, res.data.message);

  // Login tests
  res = await apiRequest("POST", "/auth/login", { email: customerEmail, password: "password123" });
  customerToken = res.token;
  log("Login Customer", res.data.status === "success", res.status);

  res = await apiRequest("POST", "/auth/login", { email: adminEmail, password: "password123" });
  adminToken = res.token;
  log("Login Admin", res.data.status === "success", res.status);

  res = await apiRequest("POST", "/auth/login", { email: sellerEmail, password: "password123" });
  sellerToken = res.token;
  log("Login Seller", res.data.status === "success", res.status);

  res = await apiRequest("POST", "/auth/login", { email: sellerEmail, password: "wrongpassword" });
  log("Login Wrong Password", res.status === 401, res.status, res.data.message);

  // Get profile
  res = await apiRequest("GET", "/auth/me", null, customerToken);
  log("Get Profile", res.data.status === "success", res.status);

  res = await apiRequest("GET", "/auth/me", null, "invalid-token");
  log("Get Profile Invalid Token", res.status === 401, res.status);

  // Approve seller (admin)
  res = await apiRequest("GET", "/admin/sellers", null, adminToken);
  const pendingSeller = res.data?.data?.sellers?.find((s) => s.status === "pending") || res.data?.data?.sellers?.[0];
  if (pendingSeller) {
    res = await apiRequest("PUT", `/seller/${pendingSeller._id}/approve`, {}, adminToken);
    log("Approve Seller", res.data.status === "success", res.status);
  }

  // Categories
  res = await apiRequest("POST", "/admin/categories", { name: "Electronics", description: "Electronic devices" }, adminToken);
  if (res.data.data?.category?._id) categoryId = res.data.data.category._id;
  log("Create Category", res.data.status === "success", res.status);

  res = await apiRequest("POST", "/admin/categories", { name: "Electronics", description: "Duplicate" }, adminToken);
  log("Duplicate Category", res.status === 400, res.status, res.data.message);

  res = await apiRequest("GET", "/categories");
  log("Get Categories", res.data.status === "success", res.status);

  // Create product as seller (requires admin approval)
  if (categoryId) {
    res = await apiRequest("POST", "/products", {
      name: "Wireless Mouse", description: "Ergonomic wireless mouse",
      price: 29.99, category: categoryId, stock: 3, minimumStock: 5,
      images: ["https://via.placeholder.com/400x400"],
    }, sellerToken);
    if (res.data.data?.product?._id) productId = res.data.data.product._id;
    log("Create Product", res.data.status === "success", res.status, res.data.message);

    // Customer creating product should fail (403)
    res = await apiRequest("POST", "/products", {
      name: "Test", description: "Test", price: 10, category: categoryId, stock: 10, minimumStock: 5, images: ["test"],
    }, customerToken);
    log("Customer Create Product (403)", res.status === 403, res.status);
  }

  // Search & filter
  res = await apiRequest("GET", "/products?search=mouse");
  log("Search Products", res.data.status === "success", res.status);

  res = await apiRequest("GET", "/products?minPrice=10&maxPrice=100");
  log("Filter by Price", res.data.status === "success", res.status);

  res = await apiRequest("GET", "/products?sortBy=price&sortOrder=asc");
  log("Sort Products", res.data.status === "success", res.status);

  // Single product + inventory
  if (productId) {
    res = await apiRequest("GET", `/products/${productId}`);
    const product = res.data.data.product;
    log("Get Single Product", res.data.status === "success", res.status);
    const isLowStock = product.lowStock;
    const statusLabel = product.stock <= product.minimumStock ? "LOW STOCK" : "IN STOCK";
    console.log(`  Inventory: stock=${product.stock}, min=${product.minimumStock}, lowStock=${isLowStock} => ${statusLabel}`);
    log("Smart Inventory Alert", isLowStock === true, res.status, statusLabel);
  }

  // Cart
  if (productId) {
    res = await apiRequest("POST", "/cart", { productId, quantity: 2 }, customerToken);
    log("Add to Cart", res.data.status === "success", res.status);

    res = await apiRequest("POST", "/cart", { productId, quantity: 999 }, customerToken);
    log("Add Excess Stock (400)", res.status === 400, res.status, res.data.message);

    res = await apiRequest("GET", "/cart", null, customerToken);
    log("Get Cart", res.data.status === "success", res.status);

    res = await apiRequest("PUT", `/cart/${productId}`, { quantity: 1 }, customerToken);
    log("Update Cart Qty", res.data.status === "success", res.status);

    res = await apiRequest("DELETE", `/cart/${productId}`, null, customerToken);
    log("Remove From Cart", res.data.status === "success", res.status);
  }

  res = await apiRequest("GET", "/cart");
  log("Cart Unauthenticated (401)", res.status === 401, res.status);

  // Wishlist
  if (productId) {
    res = await apiRequest("POST", "/wishlist", { productId }, customerToken);
    log("Add to Wishlist", res.data.status === "success", res.status);

    res = await apiRequest("POST", "/wishlist", { productId }, customerToken);
    log("Duplicate Wishlist (400)", res.status === 400, res.status, res.data.message);

    res = await apiRequest("GET", "/wishlist", null, customerToken);
    log("Get Wishlist", res.data.status === "success", res.status);

    res = await apiRequest("DELETE", `/wishlist/${productId}`, null, customerToken);
    log("Remove From Wishlist", res.data.status === "success", res.status);
  }

  // Orders
  if (productId) {
    await apiRequest("POST", "/cart", { productId, quantity: 1 }, customerToken);
    const cartRes = await apiRequest("GET", "/cart", null, customerToken);
    const sellerId = cartRes.data?.data?.cart?.items?.[0]?.product?.seller?._id || "unknown";

    res = await apiRequest("POST", "/orders", {
      items: [{ product: productId, name: "Wireless Mouse", quantity: 1, price: 29.99, seller: sellerId }],
      totalAmount: 35.98,
      shippingAddress: { fullName: "T", address: "A", city: "C", postalCode: "1", country: "U", phone: "5" },
      paymentMethod: "cod",
    }, customerToken);
    if (res.data.data?.order?._id) orderId = res.data.data.order._id;
    log("Create Order", res.data.status === "success", res.status, res.data.message);

    res = await apiRequest("GET", "/orders", null, customerToken);
    log("Get Orders", res.data.status === "success", res.status);

    if (orderId) {
      res = await apiRequest("GET", `/orders/${orderId}`, null, customerToken);
      log("Get Order by ID", res.data.status === "success", res.status);
    }

    // Insufficient stock
    res = await apiRequest("POST", "/orders", {
      items: [{ product: productId, name: "Test", quantity: 999, price: 29.99, seller: sellerId }],
      totalAmount: 9999,
      shippingAddress: { fullName: "T", address: "A", city: "C", postalCode: "1", country: "U", phone: "5" },
      paymentMethod: "cod",
    }, customerToken);
    log("Order Insufficient Stock (400)", res.status === 400, res.status, res.data.message);
  }

  // Reviews
  if (productId && orderId) {
    res = await apiRequest("POST", `/products/${productId}/reviews`, { rating: 5, comment: "Great!" }, customerToken);
    if (res.data.data?.review?._id) reviewId = res.data.data.review._id;
    log("Add Review", res.data.status === "success", res.status);

    res = await apiRequest("POST", `/products/${productId}/reviews`, { rating: 4, comment: "Another" }, customerToken);
    log("Duplicate Review (400)", res.status === 400, res.status, res.data.message);

    res = await apiRequest("GET", `/products/${productId}/reviews`);
    log("Get Reviews", res.data.status === "success", res.status);

    if (reviewId) {
      res = await apiRequest("PUT", `/products/${productId}/reviews/${reviewId}`, { rating: 4, comment: "Updated" }, customerToken);
      log("Update Review", res.data.status === "success", res.status);

      res = await apiRequest("DELETE", `/products/${productId}/reviews/${reviewId}`, null, customerToken);
      log("Delete Review", res.data.status === "success", res.status);
    }
  }

  // Admin APIs
  res = await apiRequest("GET", "/admin/dashboard", null, adminToken);
  log("Admin Dashboard", res.data.status === "success", res.status);

  res = await apiRequest("GET", "/admin/users", null, adminToken);
  log("Get All Users", res.data.status === "success", res.status);

  res = await apiRequest("GET", "/admin/sellers", null, adminToken);
  log("Get All Sellers", res.data.status === "success", res.status);

  res = await apiRequest("GET", "/admin/products", null, adminToken);
  log("Admin Get Products", res.data.status === "success", res.status);

  res = await apiRequest("GET", "/admin/orders", null, adminToken);
  log("Admin Get Orders", res.data.status === "success", res.status);

  // Admin access denied for customer
  res = await apiRequest("GET", "/admin/dashboard", null, customerToken);
  log("Customer Admin Access Denied (403)", res.status === 403, res.status, res.data.message);

  // Seller APIs
  res = await apiRequest("GET", "/seller/dashboard", null, sellerToken);
  log("Seller Dashboard", res.data.status === "success", res.status);

  res = await apiRequest("GET", "/seller/orders", null, sellerToken);
  log("Seller Orders", res.data.status === "success", res.status);

  res = await apiRequest("GET", "/products/seller/my-products", null, sellerToken);
  log("Seller My Products", res.data.status === "success", res.status);

  if (orderId) {
    res = await apiRequest("PUT", `/orders/${orderId}`, { status: "confirmed" }, sellerToken);
    log("Update Order Status", res.data.status === "success", res.status, res.data.message);
  }

  console.log(`\n=== Results: ${pass} passed, ${fail} failed ===\n`);
  process.exit(fail > 0 ? 1 : 0);
}

runTests().catch((err) => { console.error("Test error:", err.message); process.exit(1); });
