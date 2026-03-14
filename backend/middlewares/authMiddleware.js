import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes — verifies JWT and attaches user to req
export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Restrict to specific roles
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Role '${req.user.role}' is not allowed.`,
      });
    }
    next();
  };
};

// Restrict to Pro tier (SaaS feature gating)
export const requirePro = (req, res, next) => {
  if (req.user.tier !== "pro") {
    return res.status(403).json({
      message: "This feature requires a Pro subscription.",
    });
  }
  next();
};

// Free tier rate limiter — max 3 dataset analyses
export const checkFreeTierLimit = async (req, res, next) => {
  if (req.user.tier === "free" && req.user.datasetsAnalyzed >= 3) {
    return res.status(429).json({
      message:
        "Free tier limit reached (3 analyses). Upgrade to Pro for unlimited access.",
    });
  }
  next();
};
