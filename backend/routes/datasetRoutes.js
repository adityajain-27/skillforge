import express from "express";
import {
  uploadDataset,
  listDatasets,
  getDataset,
  deleteDataset,
  shareDataset,
} from "../controllers/datasetController.js";
import { protect, requireRole, checkFreeTierLimit } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Only researchers can upload; free-tier limit enforced
router.post(
  "/upload",
  protect,
  requireRole("researcher"),
  checkFreeTierLimit,
  upload.single("dataset"),
  uploadDataset
);

router.get("/list", protect, listDatasets);
router.get("/:id", protect, getDataset);
router.delete("/:id", protect, deleteDataset);
router.patch("/:id/share", protect, shareDataset);

export default router;
