const { catchAsync, AppError } = require("../utils/errorHandler");
const productService = require("../services/productService");

const createProduct = catchAsync(async (req, res, next) => {
  const product = await productService.createProduct(req.body, req.user);
  res.status(201).json({
    status: "success",
    data: { product },
  });
});

const getAllProducts = catchAsync(async (req, res, next) => {
  const result = await productService.getAllProducts(req.query);
  res.status(200).json({
    status: "success",
    count: result.products.length,
    pagination: {
      page: result.page,
      pages: result.pages,
      total: result.total,
    },
    data: { products: result.products },
  });
});

const getProductById = catchAsync(async (req, res, next) => {
  const product = await productService.getProductById(req.params.id);
  res.status(200).json({
    status: "success",
    data: { product },
  });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const product = await productService.updateProduct(
    req.params.id,
    req.body,
    req.user._id,
    req.user.role
  );
  res.status(200).json({
    status: "success",
    data: { product },
  });
});

const deleteProduct = catchAsync(async (req, res, next) => {
  await productService.deleteProduct(
    req.params.id,
    req.user._id,
    req.user.role
  );
  res.status(200).json({
    status: "success",
    data: null,
  });
});

const getSellerProducts = catchAsync(async (req, res, next) => {
  const products = await productService.getSellerProducts(req.user._id);
  res.status(200).json({
    status: "success",
    count: products.length,
    data: { products },
  });
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getSellerProducts,
};
