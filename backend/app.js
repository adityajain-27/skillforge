import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import datasetRoutes from "./routes/datasetRoutes.js";
import vizRoutes from "./routes/vizRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import collabRoutes from "./routes/collabRoutes.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Routes ----------
app.use("/api/auth", authRoutes);
app.use("/api/dataset", datasetRoutes);
app.use("/api/viz", vizRoutes);
app.use("/api/prediction", predictionRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/collab", collabRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "ClimatePro API is running 🌍" });
});

// ---------- 404 Handler ----------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ---------- Global Error Handler ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

export default app;
