const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");

const addReview = async (productId, userId, { rating, comment }) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  const purchased = await Order.findOne({
    customer: userId,
    "items.product": productId,
  });

  if (!purchased) {
    throw new Error("You can only review products you have purchased");
  }

  const existingReview = await Review.findOne({
    product: productId,
    customer: userId,
  });

  if (existingReview) {
    throw new Error("You have already reviewed this product");
  }

  const review = await Review.create({
    product: productId,
    customer: userId,
    rating,
    comment,
  });

  const reviews = await Review.find({ product: productId });
  const totalRating = reviews.reduce(
    (sum, r) => sum + r.rating,
    0
  );
  const avgRating = totalRating / reviews.length;

  await Product.findByIdAndUpdate(productId, {
    rating: avgRating,
    numReviews: reviews.length,
  });

  return review.populate("customer", "name email");
};

const updateReview = async (reviewId, userId, { rating, comment }) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new Error("Review not found");
  }

  if (review.customer.toString() !== userId.toString()) {
    throw new Error("Not authorized to update this review");
  }

  review.rating = rating !== undefined ? rating : review.rating;
  review.comment = comment !== undefined ? comment : review.comment;
  await review.save();

  return review.populate("customer", "name email");
};

const deleteReview = async (reviewId, userId) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new Error("Review not found");
  }

  if (review.customer.toString() !== userId.toString()) {
    throw new Error("Not authorized to delete this review");
  }

  await Review.findByIdAndDelete(reviewId);

  const reviews = await Review.find({ product: review.product });
  const totalRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  await Product.findByIdAndUpdate(review.product, {
    rating: totalRating,
    numReviews: reviews.length,
  });

  return { message: "Review deleted successfully" };
};

const getProductReviews = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  const reviews = await Review.find({ product: productId })
    .populate("customer", "name")
    .sort({ createdAt: -1 });

  return reviews;
};

module.exports = {
  addReview,
  updateReview,
  deleteReview,
  getProductReviews,
};
