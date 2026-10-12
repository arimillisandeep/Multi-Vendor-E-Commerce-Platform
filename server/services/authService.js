const User = require("../models/User");
const Seller = require("../models/Seller");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/generateToken");

const registerUser = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "customer",
  });

  if (user.role === "seller") {
    await Seller.create({
      user: user._id,
      storeName: `${user.name}'s Store`,
      description: "",
      status: "pending",
    });
  }

  return createUserResponse(user);
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  if (!user.isActive) {
    throw new Error("Account has been deactivated");
  }

  return createUserResponse(user);
};

const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const createUserResponse = (user) => {
  const token = generateToken(user._id);
  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    },
  };
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  createUserResponse,
};
