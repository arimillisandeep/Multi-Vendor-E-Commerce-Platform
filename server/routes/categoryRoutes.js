const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/adminController");

router.route("/")
  .get(getAllCategories)
  .post(auth, authorize("admin"), createCategory);

router.route("/:id")
  .put(auth, authorize("admin"), updateCategory)
  .delete(auth, authorize("admin"), deleteCategory);

module.exports = router;
