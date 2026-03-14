import { spawn } from "child_process";
import path from "path";
import Dataset from "../models/Dataset.js";

// Reusable helper to run Python scripts
const runPythonScript = (scriptName, args) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(`scripts/${scriptName}`);
    const proc = spawn("python", [scriptPath, ...args]);

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.stderr.on("data", (d) => (stderr += d.toString()));

    proc.on("close", (code) => {
      if (code !== 0) return reject(new Error(`Python error:\n${stderr}`));
      try {
        resolve(JSON.parse(stdout));
      } catch {
        reject(new Error(`Invalid JSON from Python:\n${stdout}`));
      }
    });
  });
};

// @desc  Get global map heatmap data for a variable and year
// @route GET /api/viz/map-data
// @access Private
export const getMapData = async (req, res) => {
  try {
    const { datasetId, variable, year } = req.query;

    if (!datasetId || !variable) {
      return res.status(400).json({ message: "datasetId and variable are required" });
    }

    const dataset = await Dataset.findById(datasetId);
    if (!dataset) return res.status(404).json({ message: "Dataset not found" });

    const result = await runPythonScript("get_map_data.py", [
      dataset.filepath,
      variable,
      year || "",
    ]);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc  Get time series data for a specific lat/lon location
// @route GET /api/viz/location-trend
// @access Private
export const getLocationTrend = async (req, res) => {
  try {
    const { datasetId, variable, lat, lon } = req.query;

    if (!datasetId || !variable || lat === undefined || lon === undefined) {
      return res.status(400).json({ message: "datasetId, variable, lat, lon are required" });
    }

    const dataset = await Dataset.findById(datasetId);
    if (!dataset) return res.status(404).json({ message: "Dataset not found" });

    const result = await runPythonScript("get_time_series.py", [
      dataset.filepath,
      variable,
      lat,
      lon,
    ]);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc  Compare two datasets for the same variable (Pro feature)
// @route GET /api/viz/compare-datasets
// @access Private (Pro tier)
export const compareDatasets = async (req, res) => {
  try {
    const { datasetIdA, datasetIdB, variable, yearA, yearB } = req.query;

    if (!datasetIdA || !datasetIdB || !variable) {
      return res
        .status(400)
        .json({ message: "datasetIdA, datasetIdB, and variable are required" });
    }

    const [dsA, dsB] = await Promise.all([
      Dataset.findById(datasetIdA),
      Dataset.findById(datasetIdB),
    ]);

    if (!dsA || !dsB) return res.status(404).json({ message: "One or both datasets not found" });

    const result = await runPythonScript("compare_datasets.py", [
      dsA.filepath,
      dsB.filepath,
      variable,
      yearA || "",
      yearB || "",
    ]);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
