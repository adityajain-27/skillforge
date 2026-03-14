import Dataset from "../models/Dataset.js";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to run python script
const runPythonScript = (scriptName, args) => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.resolve(__dirname, `../scripts/${scriptName}`);
        const process = spawn("python", [scriptPath, ...args]);
        
        let output = "";
        let error = "";

        process.stdout.on("data", (data) => { output += data.toString(); });
        process.stderr.on("data", (data) => { error += data.toString(); });

        process.on("close", (code) => {
            if (code !== 0) {
                reject(error || "Python script failed");
            } else {
                try {
                    resolve(JSON.parse(output));
                } catch (e) {
                    reject("Failed to parse Python output as JSON");
                }
            }
        });
    });
};

// @desc    Get climate prediction trend
// @route   GET /api/prediction/trend?datasetId=abc&variable=temp&lat=28.6&lon=77.2
// @access  Private/Researcher  (Requires Pro tier, simplified)
export const getPredictionTrend = async (req, res) => {
    try {
        const { datasetId, variable, lat, lon } = req.query;

        // Simulate Pro tier check
        if (!req.user.isPro) {
            return res.status(403).json({ message: "Pro tier required for predictive modeling" });
        }

        if (!datasetId || !variable || !lat || !lon) {
            return res.status(400).json({ message: "datasetId, variable, lat, and lon are required" });
        }

        const dataset = await Dataset.findById(datasetId);
        if (!dataset) {
            return res.status(404).json({ message: "Dataset not found" });
        }

        const result = await runPythonScript("predict_trend.py", [
            dataset.filePath, 
            variable, 
            lat, 
            lon
        ]);

        if (!result.success) {
            return res.status(500).json({ message: result.error });
        }

        res.json(result);

    } catch (error) {
        res.status(500).json({ message: error.toString() });
    }
};
