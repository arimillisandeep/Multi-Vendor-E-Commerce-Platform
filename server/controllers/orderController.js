const { catchAsync, AppError } = require("../utils/errorHandler");
const orderService = require("../services/orderService");

const createOrder = catchAsync(async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.body, req.user._id);
    res.status(201).json({
      status: "success",
      data: { order },
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
});

const getOrders = catchAsync(async (req, res, next) => {
  const orders = await orderService.getCustomerOrders(req.user._id);
  res.status(200).json({
    status: "success",
    count: orders.length,
    data: { orders },
  });
});

const getOrderById = catchAsync(async (req, res, next) => {
  const order = await orderService.getOrderById(
    req.params.id,
    req.user._id,
    req.user.role
  );
  res.status(200).json({
    status: "success",
    data: { order },
  });
});

const updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  try {
    const order = await orderService.updateOrderStatus(
      req.params.id,
      status,
      req.user._id,
      req.user.role
    );
    res.status(200).json({
      status: "success",
      data: { order },
    });
  } catch (error) {
    return next(new AppError(error.message, 403));
  }
});

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
