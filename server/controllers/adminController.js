const { catchAsync } = require("../utils/errorHandler");
const adminService = require("../services/adminService");

const getAdminDashboard = catchAsync(async (req, res, next) => {
  const data = await adminService.getAdminDashboard();
  res.status(200).json({
    status: "success",
    data,
  });
});

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await adminService.getAllUsers();
  res.status(200).json({
    status: "success",
    count: users.length,
    data: { users },
  });
});

const getAllSellers = catchAsync(async (req, res, next) => {
  const sellers = await adminService.getAllSellers();
  res.status(200).json({
    status: "success",
    count: sellers.length,
    data: { sellers },
  });
});

const updateUserStatus = catchAsync(async (req, res, next) => {
  const { isActive } = req.body;
  const user = await adminService.updateUserStatus(req.params.id, isActive);
  res.status(200).json({
    status: "success",
    data: { user },
  });
});

const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await adminService.getAllProducts();
  res.status(200).json({
    status: "success",
    count: products.length,
    data: { products },
  });
});

const getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await adminService.getAllOrders();
  res.status(200).json({
    status: "success",
    count: orders.length,
    data: { orders },
  });
});

const createCategory = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;
  const category = await adminService.createCategory(name, description);
  res.status(201).json({
    status: "success",
    data: { category },
  });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;
  const category = await adminService.updateCategory(
    req.params.id,
    name,
    description
  );
  res.status(200).json({
    status: "success",
    data: { category },
  });
});

const deleteCategory = catchAsync(async (req, res, next) => {
  const result = await adminService.deleteCategory(req.params.id);
  res.status(200).json({
    status: "success",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await adminService.getAllCategories();
  res.status(200).json({
    status: "success",
    count: categories.length,
    data: { categories },
  });
});

module.exports = {
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
};
