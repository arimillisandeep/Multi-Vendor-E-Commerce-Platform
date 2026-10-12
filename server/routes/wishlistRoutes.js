const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

router.use(auth, authorize("customer"));

router.route("/")
  .get(getWishlist)
  .post(addToWishlist);

router.delete("/:productId", removeFromWishlist);

module.exports = router;
