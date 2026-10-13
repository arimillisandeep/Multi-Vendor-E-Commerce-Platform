# Postman Testing Guide - Multi-Vendor E-Commerce Platform

Base URL: `http://localhost:5000/api`

## Environment Variables (Postman)
- Create a new environment with:
  - `base_url`: http://localhost:5000/api
  - `token`: (empty initially, set after login)
  - `user_email`: test@example.com
  - `user_password`: password123
  - `product_id`: (set after creating a product)

---

## 1. Authentication

### Register - Customer
- **Method**: POST
- **URL**: `{{base_url}}/auth/register`
- **Body**: 
  ```json
  {
    "name": "John Customer",
    "email": "customer@test.com",
    "password": "password123",
    "role": "customer"
  }
  ```
- **Expected**: 201 Created, returns token + user

### Register - Seller
- **Method**: POST
- **URL**: `{{base_url}}/auth/register`
- **Body**:
  ```json
  {
    "name": "Jane Seller",
    "email": "seller@test.com",
    "password": "password123",
    "role": "seller"
  }
  ```
- **Expected**: 201 Created, returns token + user, seller created with "pending" status

### Register - Admin
- **Method**: POST
- **URL**: `{{base_url}}/auth/register`
- **Body**:
  ```json
  {
    "name": "Admin User",
    "email": "admin@test.com",
    "password": "password123",
    "role": "admin"
  }
  ```
- **Expected**: 201 Created, returns token + user with admin role

### Login
- **Method**: POST
- **URL**: `{{base_url}}/auth/login`
- **Body**:
  ```json
  {
    "email": "customer@test.com",
    "password": "password123"
  }
  ```
- **Expected**: 200 OK, returns token + user
- **Tests**: Copy token to `{{token}}` environment variable
- **Set in Tests tab**:
  ```js
  const jsonData = pm.response.json();
  pm.environment.set("token", jsonData.data.token);
  pm.environment.set("user_id", jsonData.data.user.id);
  ```

### Login - Wrong Password
- **Expected**: 401 Unauthorized, "Invalid credentials"

### Login - Non-existent Email
- **Expected**: 401 Unauthorized, "Invalid credentials"

### Get Profile (Authenticated)
- **Method**: GET
- **URL**: `{{base_url}}/auth/me`
- **Headers**: `Authorization: Bearer {{token}}`
- **Expected**: 200 OK, returns user data (no password)

### Get Profile (Unauthenticated)
- **Expected**: 401 Unauthorized

---

## 2. Products

### Get All Products (Public)
- **Method**: GET
- **URL**: `{{base_url}}/products`
- **Expected**: 200 OK, returns products array

### Search Products
- **Method**: GET
- **URL**: `{{base_url}}/products?search=laptop`
- **Expected**: 200 OK, returns products matching "laptop"

### Filter by Category
- **Method**: GET
- **URL**: `{{base_url}}/products?category=<category_id>`
- **Expected**: 200 OK, returns products in that category

### Filter by Price Range
- **Method**: GET
- **URL**: `{{base_url}}/products?minPrice=100&maxPrice=1000`
- **Expected**: 200 OK, returns products in price range

### Filter by Minimum Rating
- **Method**: GET
- **URL**: `{{base_url}}/products?minRating=4`
- **Expected**: 200 OK, returns products with rating >= 4

### Sort by Price (Low to High)
- **Method**: GET
- **URL**: `{{base_url}}/products?sortBy=price&sortOrder=asc`
- **Expected**: 200 OK, returns products sorted ascending

### Sort by Price (High to Low)
- **Method**: GET
- **URL**: `{{base_url}}/products?sortBy=price&sortOrder=desc`
- **Expected**: 200 OK, returns products sorted descending

### Sort by Rating
- **Method**: GET
- **URL**: `{{base_url}}/products?sortBy=rating&sortOrder=desc`
- **Expected**: 200 OK, returns products sorted by rating

### Pagination
- **Method**: GET
- **URL**: `{{base_url}}/products?page=1&limit=5`
- **Expected**: 200 OK, returns paginated results with pagination metadata

### Get Single Product
- **Method**: GET
- **URL**: `{{base_url}}/products/<product_id>`
- **Expected**: 200 OK, returns product with lowStock/virtual field

### Get Non-existent Product
- **Expected**: 400 Bad Request, "Invalid product ID" (if ID is not valid MongoDB ObjectId)

---

## 3. Categories

### Get All Categories (Public)
- **Method**: GET
- **URL**: `{{base_url}}/categories`
- **Expected**: 200 OK, returns categories array

---

## 4. Seller - Create Product
- **Method**: POST
- **URL**: `{{base_url}}/products`
- **Headers**: `Authorization: Bearer {{seller_token}}`
- **Body**:
  ```json
  {
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse with USB receiver",
    "price": 29.99,
    "category": "<category_id>",
    "stock": 3,
    "minimumStock": 5,
    "images": ["https://via.placeholder.com/400x400?text=Wireless+Mouse"]
  }
  ```
- **Expected**: 201 Created, returns product
- **Tests**: Copy `product_id` from response

### Create Product - Unauthenticated
- **Method**: POST
- **URL**: `{{base_url}}/products`
- **Expected**: 401 Unauthorized

### Create Product - As Customer (Wrong Role)
- **Headers**: Bearer {{customer_token}}
- **Expected**: 403 Forbidden

---

## 5. Seller - Manage Products
### Update Product
- **Method**: PUT
- **URL**: `{{base_url}}/products/<product_id>`
- **Headers**: `Authorization: Bearer {{seller_token}}`
- **Body**:
  ```json
  {
    "name": "Wireless Mouse Pro",
    "price": 39.99,
    "stock": 10
  }
  ```
- **Expected**: 200 OK, returns updated product

### Delete Product
- **Method**: DELETE
- **URL**: `{{base_url}}/products/<product_id>`
- **Headers**: `Bearer {{seller_token}}`
- **Expected**: 200 OK, returns `{ "status": "success", "data": null }`

### Get Seller's Products
- **Method**: GET
- **URL**: `{{base_url}}/products/seller/my-products`
- **Headers**: `Bearer {{seller_token}}`
- **Expected**: 200 OK, returns seller's products with lowStock status

---

## 6. Cart

### Add to Cart (Authenticated Customer)
- **Method**: POST
- **URL**: `{{base_url}}/cart`
- **Headers**: `Bearer {{customer_token}}`
- **Body**:
  ```json
  {
    "productId": "<product_id>",
    "quantity": 2
  }
  ```
- **Expected**: 201 Created, returns updated cart

### Add to Cart - Exceeding Stock
- **Expected**: 400 Bad Request, "Only X items in stock"

### Get Cart
- **Method**: GET
- **URL**: `{{base_url}}/cart`
- **Headers**: `Bearer {{customer_token}}`
- **Expected**: 200 OK, returns cart with populated products

### Update Cart Item Quantity
- **Method**: PUT
- **URL**: `{{base_url}}/cart/<product_id>`
- **Headers**: `Bearer {{customer_token}}`
- **Body**:
  ```json
  { "quantity": 3 }
  ```
- **Expected**: 200 OK, returns updated cart

### Remove from Cart
- **Method**: DELETE
- **URL**: `{{base_url}}/cart/<product_id>`
- **Headers**: `Bearer {{customer_token}}`
- **Expected**: 200 OK, returns updated cart

### Cart - Unauthenticated
- **Expected**: 401 Unauthorized

---

## 7. Wishlist

### Add to Wishlist
- **Method**: POST
- **URL**: `{{base_url}}/wishlist`
- **Headers**: `Bearer {{customer_token}}`
- **Body**:
  ```json
  { "productId": "<product_id>" }
  ```
- **Expected**: 201 Created, returns wishlist

### Add Duplicate to Wishlist
- **Expected**: 400 Bad Request, "Product already in wishlist"

### Get Wishlist
- **Method**: GET
- **URL**: `{{base_url}}/wishlist`
- **Headers**: `Bearer {{customer_token}}`
- **Expected**: 200 OK, returns wishlist with products

### Remove from Wishlist
- **Method**: DELETE
- **URL**: `{{base_url}}/wishlist/<product_id>`
- **Headers**: `Bearer {{customer_token}}`
- **Expected**: 200 OK, returns updated wishlist

---

## 8. Orders

### Create Order
- **Method**: POST
- **URL**: `{{base_url}}/orders`
- **Headers**: `Bearer {{customer_token}}`
- **Body**:
  ```json
  {
    "items": [
      {
        "product": "<product_id>",
        "name": "Product Name",
        "quantity": 2,
        "price": 29.99,
        "seller": "<seller_id>"
      }
    ],
    "totalAmount": 35.98,
    "shippingAddress": {
      "fullName": "John Customer",
      "address": "123 Main St",
      "city": "New York",
      "postalCode": "10001",
      "country": "USA",
      "phone": "555-1234"
    },
    "paymentMethod": "cod"
  }
  ```
- **Expected**: 201 Created, returns order, stock is reduced, cart is cleared

### Create Order - Insufficient Stock
- **Expected**: 400 Bad Request, "Insufficient stock"

### Get Orders (Customer)
- **Method**: GET
- **URL**: `{{base_url}}/orders`
- **Headers**: `Bearer {{customer_token}}`
- **Expected**: 200 OK, returns customer's orders

### Get Order by ID
- **Method**: GET
- **URL**: `{{base_url}}/orders/<order_id>`
- **Headers**: `Bearer {{customer_token}}`
- **Expected**: 200 OK, returns order with populated items

### Update Order Status (Seller)
- **Method**: PUT
- **URL**: `{{base_url}}/orders/<order_id>`
- **Headers**: `Bearer {{seller_token}}`
- **Body**:
  ```json
  { "status": "confirmed" }
  ```
- **Expected**: 200 OK, returns updated order

### Update Order Status - Unauthorized (not seller of product)
- **Expected**: 403 Forbidden

---

## 9. Reviews

### Add Review
- **Method**: POST
- **URL**: `{{base_url}}/products/<product_id>/reviews`
- **Headers**: `Bearer {{customer_token}}`
- **Body**:
  ```json
  {
    "rating": 5,
    "comment": "Great product!"
  }
  ```
- **Expected**: 201 Created, returns review, product rating updated

### Add Review - Not Purchased
- **Expected**: 400 Bad Request, "You can only review products you have purchased"

### Add Duplicate Review
- **Expected**: 400 Bad Request, "You have already reviewed this product"

### Get Product Reviews
- **Method**: GET
- **URL**: `{{base_url}}/products/<product_id>/reviews`
- **Expected**: 200 OK, returns reviews array

### Update Review
- **Method**: PUT
- **URL**: `{{base_url}}/products/<product_id>/reviews/<review_id>`
- **Headers**: `Bearer {{customer_token}}`
- **Body**:
  ```json
  { "rating": 4, "comment": "Updated review" }
  ```
- **Expected**: 200 OK, returns updated review

### Update Review - Unauthorized
- **Expected**: 403 Forbidden (or 400 if validation fails on user)

### Delete Review
- **Method**: DELETE
- **URL**: `{{base_url}}/products/<product_id>/reviews/<review_id>`
- **Headers**: `Bearer {{customer_token}}`
- **Expected**: 200 OK, returns success message

---

## 10. Admin APIs

### Admin Dashboard
- **Method**: GET
- **URL**: `{{base_url}}/admin/dashboard`
- **Headers**: `Bearer {{admin_token}}`
- **Expected**: 200 OK, returns platform statistics

### Get All Users
- **Method**: GET
- **URL**: `{{base_url}}/admin/users`
- **Headers**: `Bearer {{admin_token}}`
- **Expected**: 200 OK, returns array of customers (excluding passwords)

### Get All Sellers
- **Method**: GET
- **URL**: `{{base_url}}/admin/sellers`
- **Headers**: `Bearer {{admin_token}}`
- **Expected**: 200 OK, returns sellers with pending status

### Approve Seller
- **Method**: PUT
- **URL**: `{{base_url}}/seller/<seller_id>/approve`
- **Headers**: `Bearer {{admin_token}}`
- **Expected**: 200 OK, returns seller with "approved" status

### Reject Seller
- **Method**: PUT
- **URL**: `{{base_url}}/seller/<seller_id>/reject`
- **Headers**: `Bearer {{admin_token}}`
- **Expected**: 200 OK, returns seller with "rejected" status

### Update User Status
- **Method**: PUT
- **URL**: `{{base_url}}/admin/users/<user_id>/status`
- **Headers**: `Bearer {{admin_token}}`
- **Body**:
  ```json
  { "isActive": false }
  ```
- **Expected**: 200 OK, returns updated user

### Get All Orders (Admin)
- **Method**: GET
- **URL**: `{{base_url}}/admin/orders`
- **Headers**: `Bearer {{admin_token}}`
- **Expected**: 200 OK, returns all orders

### Create Category
- **Method**: POST
- **URL**: `{{base_url}}/admin/categories`
- **Headers**: `Bearer {{admin_token}}`
- **Body**:
  ```json
  { "name": "Electronics", "description": "Electronic devices" }
  ```
- **Expected**: 201 Created, returns category

### Update Category
- **Method**: PUT
- **URL**: `{{base_url}}/admin/categories/<category_id>`
- **Headers**: `Bearer {{admin_token}}`
- **Body**:
  ```json
  { "name": "Updated Name", "description": "Updated desc" }
  ```
- **Expected**: 200 OK, returns updated category

### Delete Category
- **Method**: DELETE
- **URL**: `{{base_url}}/admin/categories/<category_id>`
- **Headers**: `Bearer {{admin_token}}`
- **Expected**: 200 OK, returns success message

### Admin API - Unauthorized (Customer token)
- **Expected**: 403 Forbidden

---

## 11. Error Testing Summary

| Test Case | Expected Status | Expected Message |
|-----------|----------------|-----------------|
| Register with duplicate email | 400 | User already exists |
| Login with wrong password | 401 | Invalid credentials |
| Access protected route without token | 401 | Not authorized |
| Customer accessing seller route | 403 | Not authorized to perform this action |
| Seller updating another seller's product | 404 or no product found |
| Add to cart with insufficient stock | 400 | Only X items in stock |
| Review product without purchasing | 400 | You can only review purchased products |
| Get non-existent product | 400 | Invalid product ID |
