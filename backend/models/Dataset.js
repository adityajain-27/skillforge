import mongoose from "mongoose";

const datasetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    filename: { type: String, required: true }, // stored filename on disk
    filepath: { type: String, required: true }, // full path on server
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Metadata extracted by Python/Xarray
    variables: [String], // e.g. ["temperature", "precipitation"]
    timeRange: {
      start: String,
      end: String,
    },
    spatialCoverage: {
      latMin: Number,
      latMax: Number,
      lonMin: Number,
      lonMax: Number,
    },
    // Sharing settings
    isPublic: { type: Boolean, default: false },
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Dataset = mongoose.model("Dataset", datasetSchema);
export default Dataset;
