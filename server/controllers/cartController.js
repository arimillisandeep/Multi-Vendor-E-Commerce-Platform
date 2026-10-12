const { catchAsync, AppError } = require("../utils/errorHandler");
const cartService = require("../services/cartService");

const getCart = catchAsync(async (req, res, next) => {
  const cart = await cartService.getCart(req.user._id);
  res.status(200).json({
    status: "success",
    data: { cart },
  });
});

const addToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;

  try {
    const cart = await cartService.addToCart(req.user._id, productId, quantity);
    res.status(201).json({
      status: "success",
      data: { cart },
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
});

const updateCartItem = catchAsync(async (req, res, next) => {
  const { quantity } = req.body;

  try {
    const cart = await cartService.updateCartItem(
      req.user._id,
      req.params.productId,
      quantity
    );
    res.status(200).json({
      status: "success",
      data: { cart },
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
});

const removeFromCart = catchAsync(async (req, res, next) => {
  const cart = await cartService.removeFromCart(req.user._id, req.params.productId);
  res.status(200).json({
    status: "success",
    data: { cart },
  });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
};
