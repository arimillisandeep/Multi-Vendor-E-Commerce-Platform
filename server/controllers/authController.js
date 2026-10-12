const { catchAsync, AppError } = require("../utils/errorHandler");
const authService = require("../services/authService");

const register = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  try {
    const result = await authService.registerUser({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const result = await authService.loginUser({ email, password });

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    return next(new AppError(error.message, 401));
  }
});

const getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isActive: req.user.isActive,
        createdAt: req.user.createdAt,
      },
    },
  });
});

module.exports = {
  register,
  login,
  getMe,
};
