const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const {
  productValidation,
  productIdValidation,
  productQueryValidation,
} = require("../validators/productValidators");
const validate = require("../middleware/validate");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getSellerProducts,
} = require("../controllers/productController");

router
  .route("/")
  .get(productQueryValidation, validate, getAllProducts)
  .post(
    auth,
    authorize("seller", "admin"),
    productValidation,
    validate,
    createProduct
  );

router
  .route("/:id")
  .get(productIdValidation, validate, getProductById)
  .put(auth, authorize("seller", "admin"), productIdValidation, validate, updateProduct)
  .delete(auth, authorize("seller", "admin"), productIdValidation, validate, deleteProduct);

router.get(
  "/seller/my-products",
  auth,
  authorize("seller"),
  getSellerProducts
);

module.exports = router;
