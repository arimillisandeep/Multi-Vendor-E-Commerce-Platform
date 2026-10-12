const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate({
    path: "items.product",
    populate: [
      { path: "category", select: "name" },
      {
        path: "seller",
        populate: { path: "user", select: "name storeName" },
      },
    ],
  });

  if (!cart) {
    return { items: [] };
  }

  return cart;
};

const addToCart = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }
  if (!product.isActive) {
    throw new Error("Product is not available");
  }
  if (product.stock < quantity) {
    throw new Error(`Only ${product.stock} items in stock`);
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [{ product: productId, quantity, price: product.price }],
    });
  } else {
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (product.stock < newQuantity) {
        throw new Error(`Only ${product.stock} items in stock`);
      }
      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].price = product.price;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }
    await cart.save();
  }

  return getCart(userId);
};

const updateCartItem = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }
  if (product.stock < quantity) {
    throw new Error(`Only ${product.stock} items in stock`);
  }
  if (quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new Error("Cart not found");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId.toString()
  );

  if (itemIndex === -1) {
    throw new Error("Item not found in cart");
  }

  cart.items[itemIndex].quantity = quantity;
  cart.items[itemIndex].price = product.price;
  await cart.save();

  return getCart(userId);
};

const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );

  await cart.save();
  return getCart(userId);
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
};
