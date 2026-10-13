# Multi-Vendor E-Commerce Platform

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) multi-vendor e-commerce platform inspired by Amazon and Shopify Marketplace.

## Features

### Authentication & Authorization
- JWT-based authentication with bcryptjs password hashing
- Role-based access control: **Customer**, **Seller**, **Admin**
- Protected routes with middleware

### Marketplace Features
- **Product Management**: CRUD operations with seller ownership
- **Search & Filter**: Search by name, filter by category/price/rating/seller, sort by price/rating/date
- **Shopping Cart**: Stock validation, quantity updates, persistent sessions
- **Wishlist**: Add/remove items, duplicate prevention
- **Orders**: Place orders with stock reduction, status tracking (PLACED → CONFIRMED → PACKED → SHIPPED → DELIVERED → CANCELLED)
- **Reviews**: Rating system (1-5 stars), only purchasers can review
- **Payments**: Cash on Delivery + Mock Online Payment
- **Smart Inventory**: Automatic low-stock alerts based on `stock` and `minimumStock` thresholds

### Role-Specific Dashboards
- **Customer**: Browse products, manage cart/wishlist, place orders, track status
- **Seller**: Manage products, view orders, monitor inventory, low-stock alerts
- **Admin**: Manage users/sellers/products/categories/orders, platform statistics

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Vite, React Router, JavaScript (ES6+) |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Dev Tools | Postman, VS Code, Git/GitHub |

## Architecture

```
[Browser]
   | (HTTP/HTTPS)
[React Frontend (Vite dev server:5173)]
   | (REST API HTTP requests)
[Express.js Backend (Node.js server:5000)]
   | (MongoDB driver queries)
[MongoDB Database]
```

## Project Structure

### Backend (`server/`)
```
server/
├── config/          # Database, JWT, and environment config
├── controllers/     # Route controllers (auth, products, cart, orders, etc.)
├── middleware/      # Auth, role, error handlers
├── models/          # Mongoose schemas (User, Seller, Product, Cart, Order, Review, Wishlist)
├── routes/          # API route definitions
├── services/        # Business logic layer
├── validators/      # Request validation with express-validator
├── utils/           # Error handling, utilities
├── integrationTest.js  # End-to-end test script (50 tests)
└── server.js        # Entry point
```

### Frontend (`client/`)
```
client/
├── src/
│   ├── components/   # Reusable UI components
│   ├── context/      # React context (Auth, Cart)
│   ├── hooks/        # Custom React hooks
│   ├── layouts/      # Page layouts
│   ├── pages/        # Route pages (Home, Products, Cart, etc.)
│   ├── services/     # API service modules
│   ├── styles/       # CSS modules
│   ├── utils/        # Utility functions
│   ├── App.jsx       # Root component with routing
│   └── main.jsx      # Entry point
└── vite.config.js    # Vite config
```

## Database Models

| Model | Key Fields |
|-------|-----------|
| **User** | `name`, `email`, `password` (hashed), `role`, `isActive`, `createdAt` |
| **Seller** | `user` (ref), `storeName`, `description`, `status` (pending/approved), `createdAt` |
| **Category** | `name`, `description` |
| **Product** | `seller` (ref), `category` (ref), `name`, `description`, `price`, `stock`, `minimumStock`, `images`, `rating`, `lowStock` (computed) |
| **Cart** | `user` (ref), `items[]` |
| **Order** | `customer` (ref), `items[]`, `totalAmount`, `shippingAddress`, `paymentMethod`, `paymentStatus`, `orderStatus` |
| **Review** | `product` (ref), `customer` (ref), `rating` (1-5), `comment` |
| **Wishlist** | `customer` (ref), `products[]` |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register (Customer, Seller, Admin)
- `POST /api/auth/login` - Login, returns JWT token

### Users
- `GET /api/auth/me` - Get current user profile

### Products
- `GET /api/products` - List with search/filter/sort
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create (Seller/Admin only)
- `PUT /api/products/:id` - Update (owner/Admin only)
- `DELETE /api/products/:id` - Delete (owner/Admin only)

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create (Admin only)

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart` - Add item
- `PUT /api/cart/:productId` - Update quantity
- `DELETE /api/cart/:productId` - Remove item

### Wishlist
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:productId` - Remove item

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update status (Seller/Admin)

### Reviews
- `POST /api/products/:productId/reviews` - Add review (purchasers only)
- `GET /api/products/:productId/reviews` - Get reviews
- `PUT /api/products/:productId/reviews/:id` - Update review
- `DELETE /api/products/:productId/reviews/:id` - Delete review

### Seller
- `GET /api/seller/dashboard` - Seller dashboard data
- `GET /api/seller/orders` - Seller's orders
- `GET /api/products/seller/my-products` - Seller's products

### Admin
- `GET /api/admin/dashboard` - Platform statistics
- `GET /api/admin/users` - All users
- `GET /api/admin/sellers` - All sellers
- `GET /api/admin/products` - All products
- `GET /api/admin/orders` - All orders

## Getting Started

### Prerequisites
- Node.js >= 16
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/username/multi-vendor-ecommerce.git
cd multi-vendor-ecommerce

# Install backend dependencies
cd server
npm install
npm install --save-dev mongodb-memory-server

# Install frontend dependencies
cd ../client
npm install

# Environment variables
# In server/: create .env file
echo "MONGODB_URI=mongodb://localhost:27017/ecommerce" > ../server/.env
echo "JWT_SECRET=your_jwt_secret_key" >> ../server/.env
echo "JWT_EXPIRES_IN=7d" >> ../server/.env
```

### Running the Application

```bash
# Terminal 1: Backend server (port 5000)
cd server
node server.js

# Terminal 2: Frontend dev server (port 5173)
cd client
npm run dev
```

The server uses `mongodb-memory-server` as a fallback when no `MONGODB_URI` is provided, enabling zero-config local development.

### Running Tests

```bash
# Integration tests (50 scenarios)
cd server
node integrationTest.js
```

## Documentation

- [Security Guide](./SECURITY.md) - Security best practices and audit
- [Debugging Guide](./DEBUGGING.md) - Troubleshooting common issues
- [Postman Tests](./POSTMAN_TESTS.md) - Manual API testing reference

## License

MIT
