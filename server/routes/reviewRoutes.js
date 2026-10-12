const express = require("express");
const router = express.Router({ mergeParams: true });
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const {
  addReview,
  updateReview,
  deleteReview,
  getProductReviews,
} = require("../controllers/reviewController");

router.route("/")
  .get(getProductReviews)
  .post(auth, authorize("customer"), addReview);

router.route("/:id")
  .put(auth, authorize("customer"), updateReview)
  .delete(auth, authorize("customer"), deleteReview);

module.exports = router;
