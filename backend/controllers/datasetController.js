import { spawn } from "child_process";
import path from "path";
import Dataset from "../models/Dataset.js";
import User from "../models/User.js";

// Helper: run a Python script and return parsed JSON output
const runPythonScript = (scriptName, args) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(`scripts/${scriptName}`);
    const process = spawn("python", [scriptPath, ...args]);

    let stdout = "";
    let stderr = "";

    process.stdout.on("data", (data) => (stdout += data.toString()));
    process.stderr.on("data", (data) => (stderr += data.toString()));

    process.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`Python script error:\n${stderr}`));
      }
      try {
        resolve(JSON.parse(stdout));
      } catch {
        reject(new Error(`Failed to parse Python output:\n${stdout}`));
      }
    });
  });
};

// @desc  Upload a NetCDF dataset
// @route POST /api/dataset/upload
// @access Private (Researcher only)
export const uploadDataset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { name, description } = req.body;
    const filePath = req.file.path;

    // Call Python script to parse metadata from .nc file
    const metadata = await runPythonScript("parse_dataset.py", [filePath]);

    const dataset = await Dataset.create({
      name: name || req.file.originalname,
      description: description || "",
      filename: req.file.filename,
      filepath: filePath,
      uploadedBy: req.user._id,
      variables: metadata.variables || [],
      timeRange: metadata.timeRange || {},
      spatialCoverage: metadata.spatialCoverage || {},
    });

    // Increment free-tier counter
    if (req.user.tier === "free") {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { datasetsAnalyzed: 1 },
      });
    }

    return res.status(201).json({ message: "Dataset uploaded successfully", dataset });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc  List all accessible datasets
// @route GET /api/dataset/list
// @access Private
export const listDatasets = async (req, res) => {
  try {
    const query = {
      $or: [
        { uploadedBy: req.user._id },
        { isPublic: true },
        { sharedWith: req.user._id },
      ],
    };

    const datasets = await Dataset.find(query)
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json(datasets);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc  Get a single dataset metadata
// @route GET /api/dataset/:id
// @access Private
export const getDataset = async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id).populate(
      "uploadedBy",
      "name email"
    );
    if (!dataset) {
      return res.status(404).json({ message: "Dataset not found" });
    }
    return res.status(200).json(dataset);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc  Delete a dataset
// @route DELETE /api/dataset/:id
// @access Private (owner only)
export const deleteDataset = async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id);
    if (!dataset) {
      return res.status(404).json({ message: "Dataset not found" });
    }
    if (dataset.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this dataset" });
    }
    await dataset.deleteOne();
    return res.status(200).json({ message: "Dataset deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc  Share dataset with another user
// @route PATCH /api/dataset/:id/share
// @access Private (owner or researcher)
export const shareDataset = async (req, res) => {
  try {
    const { userId, makePublic } = req.body;
    const dataset = await Dataset.findById(req.params.id);

    if (!dataset) {
      return res.status(404).json({ message: "Dataset not found" });
    }
    if (dataset.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (makePublic !== undefined) {
      dataset.isPublic = makePublic;
    }
    if (userId && !dataset.sharedWith.includes(userId)) {
      dataset.sharedWith.push(userId);
    }

    await dataset.save();
    return res.status(200).json({ message: "Dataset sharing updated", dataset });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
