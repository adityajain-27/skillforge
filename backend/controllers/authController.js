import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc  Register new user
// @route POST /api/auth/signup
// @access Public
export const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists with this email" });
    }

    // Only allow valid roles; default to 'public'
    const allowedRoles = ["public", "researcher"];
    const userRole = allowedRoles.includes(role) ? role : "public";

    const user = await User.create({ name, email, password, role: userRole });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      tier: user.tier,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Login user
// @route POST /api/auth/login
// @access Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      tier: user.tier,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get current logged-in user profile
// @route GET /api/auth/profile
// @access Private
export const getProfile = async (req, res) => {
  const user = req.user;
  return res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    tier: user.tier,
    datasetsAnalyzed: user.datasetsAnalyzed,
  });
};

// @desc  Upgrade user to Pro tier (simulated SaaS toggle)
// @route PATCH /api/auth/upgrade
// @access Private
export const upgradeToPro = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { tier: "pro" },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      message: "Upgraded to Pro tier successfully",
      tier: user.tier,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
