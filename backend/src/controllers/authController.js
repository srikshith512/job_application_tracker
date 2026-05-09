import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

const buildAuthResponse = (user) => ({
  user: {
    id: user._id,
    name: user.name,
    email: user.email
  },
  token: generateToken(user._id)
});

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("An account with this email already exists.");
      error.statusCode = 409;
      throw error;
    }

    const user = await User.create({ name, email, password });
    res.status(201).json(buildAuthResponse(user));
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      const error = new Error("Invalid email or password.");
      error.statusCode = 401;
      throw error;
    }

    res.json(buildAuthResponse(user));
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email
  });
};
