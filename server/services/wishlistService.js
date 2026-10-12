const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

const getWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ customer: userId }).populate({
    path: "products",
    populate: [
      { path: "category", select: "name" },
      {
        path: "seller",
        populate: { path: "user", select: "name storeName" },
      },
    ],
  });

  if (!wishlist) {
    return { products: [] };
  }

  return wishlist;
};

const addToWishlist = async (userId, productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  let wishlist = await Wishlist.findOne({ customer: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({
      customer: userId,
      products: [productId],
    });
  } else {
    const exists = wishlist.products.some(
      (p) => p.toString() === productId.toString()
    );
    if (exists) {
      throw new Error("Product already in wishlist");
    }
    wishlist.products.push(productId);
    await wishlist.save();
  }

  return getWishlist(userId);
};

const removeFromWishlist = async (userId, productId) => {
  const wishlist = await Wishlist.findOne({ customer: userId });
  if (!wishlist) {
    throw new Error("Wishlist not found");
  }

  wishlist.products = wishlist.products.filter(
    (p) => p.toString() !== productId.toString()
  );

  await wishlist.save();
  return getWishlist(userId);
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
