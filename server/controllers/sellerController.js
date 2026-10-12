const { catchAsync, AppError } = require("../utils/errorHandler");
const sellerService = require("../services/sellerService");

const getSellerDashboard = catchAsync(async (req, res, next) => {
  const dashboardData = await sellerService.getSellerDashboard(req.user._id);
  res.status(200).json({
    status: "success",
    data: dashboardData,
  });
});

const getSellerOrders = catchAsync(async (req, res, next) => {
  const orders = await require("../services/orderService").getSellerOrders(req.user._id);
  res.status(200).json({
    status: "success",
    count: orders.length,
    data: { orders },
  });
});

const approveSeller = catchAsync(async (req, res, next) => {
  const seller = await sellerService.updateSellerStatus(
    req.params.id,
    "approved"
  );
  res.status(200).json({
    status: "success",
    data: { seller },
  });
});

const rejectSeller = catchAsync(async (req, res, next) => {
  const seller = await sellerService.updateSellerStatus(
    req.params.id,
    "rejected"
  );
  res.status(200).json({
    status: "success",
    data: { seller },
  });
});

module.exports = {
  getSellerDashboard,
  getSellerOrders,
  approveSeller,
  rejectSeller,
};
