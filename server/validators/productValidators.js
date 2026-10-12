const { body, param, query } = require("express-validator");

const productValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ max: 200 })
    .withMessage("Product name cannot exceed 200 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("minimumStock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Minimum stock must be a non-negative integer"),
  body("images")
    .isArray({ min: 1 })
    .withMessage("At least one product image is required"),
];

const productIdValidation = [
  param("id").isMongoId().withMessage("Invalid product ID"),
];

const productQueryValidation = [
  query("search").optional().trim(),
  query("category").optional().trim(),
  query("seller").optional().trim(),
  query("minPrice").optional().isFloat({ min: 0 }),
  query("maxPrice").optional().isFloat({ min: 0 }),
  query("minRating").optional().isInt({ min: 0, max: 5 }),
  query("sortBy").optional().isIn(["price", "createdAt", "rating"]),
  query("sortOrder").optional().isIn(["asc", "desc"]),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
];

module.exports = {
  productValidation,
  productIdValidation,
  productQueryValidation,
};
