const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const {
  getAdminDashboard,
  getAllUsers,
  getAllSellers,
  updateUserStatus,
  getAllProducts,
  getAllOrders,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
} = require("../controllers/adminController");

router.use(auth, authorize("admin"));

router.get("/dashboard", getAdminDashboard);

router.route("/users")
  .get(getAllUsers);

router.route("/users/:id/status")
  .put(updateUserStatus);

router.route("/sellers")
  .get(getAllSellers);

router.route("/products")
  .get(getAllProducts);

router.route("/orders")
  .get(getAllOrders);

router.route("/categories")
  .get(getAllCategories)
  .post(createCategory);

router.route("/categories/:id")
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
