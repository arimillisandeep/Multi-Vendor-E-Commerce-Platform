const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { sendError } = require("./utils/errorHandler");

require("dotenv").config({ path: __dirname + "/.env" });

connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Multi-Vendor E-Commerce API is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api", (req, res) => {
  res.json({
    status: "success",
    message: "Multi-Vendor E-Commerce API",
    endpoints: {
      auth: "/api/auth (register, login, me)",
      products: "/api/products (CRUD, search, filter, sort)",
      categories: "/api/categories",
      cart: "/api/cart (add, update, remove)",
      wishlist: "/api/wishlist",
      orders: "/api/orders",
      reviews: "/api/products/:id/reviews",
      seller: "/api/seller (dashboard, orders, my-products)",
      admin: "/api/admin (dashboard, users, sellers, products, orders, categories)",
    },
  });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/products/:productId/reviews", require("./routes/reviewRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/seller", require("./routes/sellerRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));

app.use(sendError);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
