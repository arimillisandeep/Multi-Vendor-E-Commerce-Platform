const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");

router.use(auth);

router.route("/")
  .post(authorize("customer"), createOrder)
  .get(getOrders);

router.route("/:id")
  .get(getOrderById)
  .put(authorize("seller", "admin"), updateOrderStatus);

module.exports = router;
