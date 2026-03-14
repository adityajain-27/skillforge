import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dataset: { type: mongoose.Schema.Types.ObjectId, ref: "Dataset" },
    storyId: { type: String }, // for story-mode comments
    text: { type: String, required: true },
    // For sticky note annotations: optional x,y position on chart
    annotation: {
      x: Number,
      y: Number,
      label: String,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
