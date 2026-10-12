const Seller = require("../models/Seller");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const getSellerDashboard = async (userId) => {
  const seller = await Seller.findOne({ user: userId });
  if (!seller) {
    throw new Error("Seller not found");
  }

  const products = await Product.find({ seller: seller._id });
  const totalProducts = products.length;
  const lowStockProducts = products.filter(
    (p) => p.stock <= p.minimumStock
  ).length;
  const outOfStockProducts = products.filter((p) => p.stock === 0).length;

  const orders = await Order.find({ "items.seller": seller._id });

  const totalRevenue = orders.reduce((sum, order) => {
    const sellerItems = order.items.filter(
      (item) => item.seller.toString() === seller._id.toString()
    );
    const orderTotal = sellerItems.reduce(
      (itemSum, item) => itemSum + item.price * item.quantity,
      0
    );
    if (order.orderStatus !== "cancelled") {
      return sum + orderTotal;
    }
    return sum;
  }, 0);

  const pendingOrders = orders.filter(
    (o) => o.orderStatus === "placed" || o.orderStatus === "confirmed"
  ).length;

  const lowStockList = await Product.find({
    seller: seller._id,
    $expr: { $lte: ["$stock", "$minimumStock"] },
  }).sort({ stock: 1 });

  return {
    totalProducts,
    lowStockProducts: lowStockList,
    lowStockCount: lowStockProducts,
    outOfStockProducts: outOfStockProducts,
    totalOrders: orders.length,
    pendingOrders,
    totalRevenue,
  };
};

const updateSellerStatus = async (sellerId, status) => {
  const seller = await Seller.findById(sellerId).populate("user", "name email");
  if (!seller) {
    throw new Error("Seller not found");
  }

  seller.status = status;
  await seller.save();

  return seller;
};

module.exports = {
  getSellerDashboard,
  updateSellerStatus,
};
