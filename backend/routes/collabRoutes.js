import express from "express";
import {
  addComment,
  getComments,
  deleteComment,
} from "../controllers/collabController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/comments", protect, addComment);
router.get("/comments", protect, getComments);
router.delete("/comments/:id", protect, deleteComment);

export default router;
