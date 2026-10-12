const Product = require("../models/Product");
const Seller = require("../models/Seller");
const User = require("../models/User");

const createProduct = async (productData, sellerUser) => {
  const seller = await Seller.findOne({ user: sellerUser._id });
  if (!seller || seller.status !== "approved") {
    throw new Error("Seller account is not approved");
  }

  const product = await Product.create({
    ...productData,
    seller: seller._id,
  });

  return product.populate(["category", "seller"]);
};

const getAllProducts = async (query) => {
  const {
    search,
    category,
    seller: sellerQuery,
    minPrice,
    maxPrice,
    minRating,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 12,
  } = query;

  const filter = { isActive: true };

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  if (category) {
    filter.category = category;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (minRating) {
    filter.rating = { $gte: Number(minRating) };
  }

  if (sellerQuery) {
    filter.seller = sellerQuery;
  }

  const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
  const skip = (Number(page) - 1) * Number(limit);

  const products = await Product.find(filter)
    .populate("category", "name")
    .populate({
      path: "seller",
      populate: { path: "user", select: "name email" },
    })
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  const total = await Product.countDocuments(filter);

  return {
    products,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    total,
  };
};

const getProductById = async (productId) => {
  const product = await Product.findById(productId)
    .populate("category", "name")
    .populate({
      path: "seller",
      populate: { path: "user", select: "name email" },
    });

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

const updateProduct = async (productId, updateData, userId, userRole) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (userRole !== "admin") {
    const seller = await Seller.findOne({ user: userId });
    if (!seller || product.seller.toString() !== seller._id.toString()) {
      throw new Error("Not authorized to update this product");
    }
  }

  Object.assign(product, updateData);
  await product.save();

  return product.populate(["category", "seller"]);
};

const deleteProduct = async (productId, userId, userRole) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (userRole !== "admin") {
    const seller = await Seller.findOne({ user: userId });
    if (!seller || product.seller.toString() !== seller._id.toString()) {
      throw new Error("Not authorized to delete this product");
    }
  }

  await Product.findByIdAndDelete(productId);
};

const getSellerProducts = async (userId) => {
  const seller = await Seller.findOne({ user: userId });
  if (!seller) {
    throw new Error("Seller not found");
  }
  const products = await Product.find({ seller: seller._id })
    .populate("category", "name")
    .sort({ createdAt: -1 });
  return products;
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getSellerProducts,
};
