const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} = require("../controllers/cartController");

router.use(auth, authorize("customer"));

router.route("/")
  .get(getCart)
  .post(addToCart);

router.route("/:productId")
  .put(updateCartItem)
  .delete(removeFromCart);

module.exports = router;
