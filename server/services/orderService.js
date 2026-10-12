const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Seller = require("../models/Seller");

const createOrder = async (orderData, userId) => {
  const { items, totalAmount, shippingAddress, paymentMethod } = orderData;

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new Error("Product not found");
    }
    if (product.stock < item.quantity) {
      throw new Error(
        `Insufficient stock for ${product.name}. Only ${product.stock} available.`
      );
    }
  }

  const order = await Order.create({
    customer: userId,
    items,
    totalAmount,
    shippingAddress,
    paymentMethod,
    paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
  });

  for (const item of items) {
    await Product.findByIdAndUpdate(
      item.product,
      { $inc: { stock: -item.quantity } },
      { new: true }
    );
  }

  await Cart.findOneAndDelete({ user: userId });

  return order.populate([
    "customer",
    "items.product",
    "items.seller",
  ]);
};

const getCustomerOrders = async (userId) => {
  const orders = await Order.find({ customer: userId })
    .populate("items.product")
    .populate("items.seller")
    .sort({ createdAt: -1 });
  return orders;
};

const getOrderById = async (orderId, userId, userRole) => {
  const order = await Order.findById(orderId)
    .populate("customer", "name email")
    .populate("items.product")
    .populate("items.seller");

  if (!order) {
    throw new Error("Order not found");
  }

  if (userRole !== "admin") {
    if (order.customer._id.toString() !== userId.toString()) {
      const seller = await Seller.findOne({ user: userId });
      if (!seller) {
        throw new Error("Not authorized to view this order");
      }
      const isInvolved = order.items.some(
        (item) => item.seller && item.seller._id.toString() === seller._id.toString()
      );
      if (!isInvolved) {
        throw new Error("Not authorized to view this order");
      }
    }
  }

  return order;
};

const updateOrderStatus = async (orderId, status, userId, userRole) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  if (userRole !== "admin") {
    const seller = await Seller.findOne({ user: userId });
    if (!seller) {
      throw new Error("Not authorized to update this order");
    }
    const isInvolved = order.items.some(
      (item) => item.seller && item.seller.toString() === seller._id.toString()
    );
    if (!isInvolved) {
      throw new Error("Not authorized to update this order");
    }
  }

  order.orderStatus = status;
  if (status === "delivered") {
    order.paymentStatus = "paid";
  }
  await order.save();

  return order.populate(["items.product", "items.seller"]);
};

const getAllOrders = async () => {
  const orders = await Order.find({})
    .populate("customer", "name email")
    .populate("items.product")
    .populate("items.seller")
    .sort({ createdAt: -1 });
  return orders;
};

const getSellerOrders = async (userId) => {
  const seller = await Seller.findOne({ user: userId });
  if (!seller) {
    throw new Error("Seller not found");
  }

  const orders = await Order.find({ "items.seller": seller._id })
    .populate("customer", "name email")
    .populate("items.product")
    .populate("items.seller")
    .sort({ createdAt: -1 });
  return orders;
};

module.exports = {
  createOrder,
  getCustomerOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getSellerOrders,
};
