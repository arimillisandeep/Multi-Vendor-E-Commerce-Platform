const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { sendError } = require("./utils/errorHandler");

require("dotenv").config();

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
