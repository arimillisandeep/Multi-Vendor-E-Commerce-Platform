const { catchAsync, AppError } = require("../utils/errorHandler");
const wishlistService = require("../services/wishlistService");

const getWishlist = catchAsync(async (req, res, next) => {
  const wishlist = await wishlistService.getWishlist(req.user._id);
  res.status(200).json({
    status: "success",
    data: { wishlist },
  });
});

const addToWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.body;

  try {
    const wishlist = await wishlistService.addToWishlist(req.user._id, productId);
    res.status(201).json({
      status: "success",
      data: { wishlist },
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
});

const removeFromWishlist = catchAsync(async (req, res, next) => {
  const wishlist = await wishlistService.removeFromWishlist(
    req.user._id,
    req.params.productId
  );
  res.status(200).json({
    status: "success",
    data: { wishlist },
  });
});

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
