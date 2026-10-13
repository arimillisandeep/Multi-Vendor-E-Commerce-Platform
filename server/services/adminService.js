const { AppError } = require("../utils/errorHandler");

const User = require("../models/User");
const Seller = require("../models/Seller");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Category = require("../models/Category");

const getAdminDashboard = async () => {
  const [
    totalUsers,
    totalSellers,
    pendingSellers,
    totalProducts,
    totalOrders,
    categories,
    totalRevenueResult,
  ] = await Promise.all([
    User.countDocuments({ role: "customer", isActive: true }),
    Seller.countDocuments({ status: "approved" }),
    Seller.countDocuments({ status: "pending" }),
    Product.countDocuments({ isActive: true }),
    Order.countDocuments({}),
    Category.countDocuments({}),
    Order.aggregate([
      {
        $match: { orderStatus: { $ne: "cancelled" } },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]),
  ]);

  const totalRevenue = totalRevenueResult[0]?.total || 0;

  return {
    totalUsers,
    totalSellers,
    pendingSellers,
    totalProducts,
    totalOrders,
    totalCategories: categories,
    totalRevenue,
  };
};

const getAllUsers = async () => {
  const users = await User.find({ role: "customer" }).select("-password");
  return users;
};

const getAllSellers = async () => {
  const sellers = await Seller.find({})
    .populate("user", "name email isActive createdAt")
    .sort({ createdAt: -1 });
  return sellers;
};

const updateUserStatus = async (userId, isActive) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isActive },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

const getAllProducts = async () => {
  const products = await Product.find({})
    .populate("category", "name")
    .populate({
      path: "seller",
      populate: { path: "user", select: "name email" },
    })
    .sort({ createdAt: -1 });
  return products;
};

const getAllOrders = async () => {
  const orders = await Order.find({})
    .populate("customer", "name email")
    .populate("items.product")
    .populate("items.seller")
    .sort({ createdAt: -1 });
  return orders;
};

const createCategory = async (name, description) => {
  const existing = await Category.findOne({ name });
  if (existing) {
    throw new AppError("Category already exists", 400);
  }

  const category = await Category.create({ name, description });
  return category;
};

const updateCategory = async (categoryId, name, description) => {
  const category = await Category.findByIdAndUpdate(
    categoryId,
    { name, description },
    { new: true, runValidators: true }
  );

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return category;
};

const deleteCategory = async (categoryId) => {
  const category = await Category.findByIdAndDelete(categoryId);
  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return { message: "Category deleted successfully" };
};

const getAllCategories = async () => {
  const categories = await Category.find({}).sort({ name: 1 });
  return categories;
};

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
