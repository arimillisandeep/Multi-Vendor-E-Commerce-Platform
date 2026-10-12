# Multi-Vendor E-Commerce Platform - Project Plan

## 1. Project Objective
Build a professional, responsive multi-vendor e-commerce platform where multiple sellers can sell products and customers can purchase them.

## 2. Real-world Use Case
Like Amazon or Shopify Marketplace:
- Sellers register, list products, manage inventory, fulfill orders
- Customers browse, search, filter, add to cart, checkout, track orders
- Admin manages the entire platform

## 3. User Roles
1. **Customer** - Registers, browses, shops, orders, reviews
2. **Seller** - Registers (needs admin approval), adds/edits products, manages inventory, views orders, gets low-stock alerts
3. **Admin** - Manages users, sellers, products, categories, orders, platform statistics

## 4. Features
- JWT Authentication with bcryptjs password hashing
- Role-based authorization (customer/seller/admin)
- Product CRUD with seller ownership
- Product search, filter (category/price/rating/seller), sort
- Shopping cart with stock validation
- Wishlist with duplicate prevention
- Order placement with stock reduction
- Order status tracking (PLACED → CONFIRMED → PACKED → SHIPPED → DELIVERED / CANCELLED)
- Reviews (only for purchased products, rating 1-5)
- Payment: Cash on Delivery + Mock Online Payment
- Smart Inventory: stock + minimumStock, automatic low-stock detection

## 5. Technologies
- **Frontend**: React.js, JavaScript, HTML5, CSS3, React Router, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Auth**: JWT, bcryptjs
- **Tools**: Git, GitHub, Postman, VS Code

## 6. Architecture
```
[Browser]
   | (HTTP/HTTPS)
[React Frontend (Vite dev server)]
   | (REST API HTTP requests)
[Express.js Backend (Node.js server)]
   | (MongoDB driver queries)
[MongoDB Database]
```

### Interview Explanation of Architecture:
"This is a standard 3-tier architecture. The React frontend makes HTTP requests to a REST API built with Express. Express processes requests through middleware (authentication, validation), calls Mongoose to interact with MongoDB, and returns JSON responses. React receives the JSON and renders the UI. The frontend and backend are completely separate applications - the frontend runs on port 3000 (Vite) and the backend runs on port 5000, communicating over HTTP."

## 7. Database Design
| Model | Key Fields |
|-------|-----------|
| User | _id, name, email, password, role, isActive, createdAt |
| Seller | _id, user(ref), storeName, description, status, createdAt |
| Category | _id, name, description |
| Product | _id, seller(ref), category(ref), name, description, price, stock, minimumStock, images, rating, isActive, createdAt, updatedAt |
| Cart | _id, user(ref), items[] |
| Order | _id, customer(ref), items[], totalAmount, shippingAddress, paymentMethod, paymentStatus, orderStatus, createdAt |
| Review | _id, product(ref), customer(ref), rating, comment, createdAt |
| Wishlist | _id, customer(ref), products[] |

## 8. API Design
- `POST /api/auth/register` - Register (Customer or Seller)
- `POST /api/auth/login` - Login, returns JWT
- `GET /api/auth/me` - Get current user
- `GET /api/products` - List products (with search/filter/sort)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Seller/Admin)
- `PUT /api/products/:id` - Update product (owner/Admin)
- `DELETE /api/products/:id` - Delete product (owner/Admin)
- `GET /api/cart` - Get cart
- `POST /api/cart` - Add item
- `PUT /api/cart/:productId` - Update quantity
- `DELETE /api/cart/:productId` - Remove item
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist
- `POST /api/orders` - Create order
- `GET /api/orders` - Get orders (user-specific)
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (Seller/Admin)
- `POST /api/reviews` - Add review (purchasers only)
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `GET /api/seller/dashboard` - Seller dashboard data
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category (Admin)

## 9. Frontend Pages
**Public**: Home, Products, ProductDetails, Login, Register
**Customer**: Cart, Checkout, Orders, OrderDetails, Wishlist, Profile
**Seller**: SellerDashboard, SellerProducts, AddProduct, EditProduct, SellerOrders, SellerInventory, SellerProfile
**Admin**: AdminDashboard, ManageUsers, ManageSellers, ManageProducts, ManageCategories, ManageOrders
**Other**: NotFound, Loading, Error

## 10. Development Roadmap
1. Environment setup and project structure
2. Backend: models, DB connection, auth, middleware
3. Backend: products, cart, wishlist, orders, reviews
4. Backend: seller/admin APIs, inventory alerts
5. Frontend: structure, components, routing, services
6. Frontend: pages, UI integration
7. Testing, debugging, security review
8. GitHub, deployment, documentation
9. Interview preparation

## Unique Feature: Smart Inventory Alert
Every product has `stock` and `minimumStock`. When `stock <= minimumStock`, the product is flagged as "LOW STOCK". This is calculated in real-time from the database (not stored duplicate data). The seller dashboard displays:
- Total products
- Low stock products
- Out of stock products (stock === 0)
