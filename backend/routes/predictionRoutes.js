import express from "express";
import { getPredictionTrend } from "../controllers/predictionController.js";
import { protect, requirePro } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Prediction is a Pro-only feature
router.get("/trend", protect, requirePro, getPredictionTrend);

export default router;
