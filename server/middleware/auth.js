const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { AppError } = require("../utils/errorHandler");

const auth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Not authorized to access this route", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return next(new AppError("User no longer exists", 401));
    }
    if (!req.user.isActive) {
      return next(new AppError("User account is deactivated", 401));
    }
    next();
  } catch (error) {
    return next(new AppError("Not authorized to access this route", 401));
  }
};

module.exports = auth;
