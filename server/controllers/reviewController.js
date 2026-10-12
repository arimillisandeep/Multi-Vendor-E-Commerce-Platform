const { catchAsync, AppError } = require("../utils/errorHandler");
const reviewService = require("../services/reviewService");

const addReview = catchAsync(async (req, res, next) => {
  const { rating, comment } = req.body;

  try {
    const review = await reviewService.addReview(
      req.params.productId,
      req.user._id,
      { rating, comment }
    );
    res.status(201).json({
      status: "success",
      data: { review },
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
});

const updateReview = catchAsync(async (req, res, next) => {
  const { rating, comment } = req.body;

  try {
    const review = await reviewService.updateReview(
      req.params.id,
      req.user._id,
      { rating, comment }
    );
    res.status(200).json({
      status: "success",
      data: { review },
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
});

const deleteReview = catchAsync(async (req, res, next) => {
  const result = await reviewService.deleteReview(req.params.id, req.user._id);
  res.status(200).json({
    status: "success",
    data: result,
  });
});

const getProductReviews = catchAsync(async (req, res, next) => {
  const reviews = await reviewService.getProductReviews(req.params.productId);
  res.status(200).json({
    status: "success",
    count: reviews.length,
    data: { reviews },
  });
});

module.exports = {
  addReview,
  updateReview,
  deleteReview,
  getProductReviews,
};
