const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const {
  getSellerDashboard,
  getSellerOrders,
  approveSeller,
  rejectSeller,
} = require("../controllers/sellerController");

router.use(auth);

router.get("/dashboard", authorize("seller"), getSellerDashboard);
router.get("/orders", authorize("seller"), getSellerOrders);

router.use(authorize("admin"));

router.put("/:id/approve", approveSeller);
router.put("/:id/reject", rejectSeller);

module.exports = router;
