import Comment from "../models/Comment.js";

// @desc  Add a comment or sticky note
// @route POST /api/collab/comments
// @access Private
export const addComment = async (req, res) => {
  try {
    const { datasetId, storyId, text, annotation } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const comment = await Comment.create({
      author: req.user._id,
      dataset: datasetId || undefined,
      storyId: storyId || undefined,
      text,
      annotation: annotation || {},
    });

    await comment.populate("author", "name email");
    return res.status(201).json(comment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc  Get all comments for a dataset or story
// @route GET /api/collab/comments
// @access Private
export const getComments = async (req, res) => {
  try {
    const { datasetId, storyId } = req.query;

    const filters = {};
    if (datasetId) filters.dataset = datasetId;
    if (storyId) filters.storyId = storyId;

    if (!datasetId && !storyId) {
      return res.status(400).json({ message: "Either datasetId or storyId is required" });
    }

    const comments = await Comment.find(filters)
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc  Delete a comment
// @route DELETE /api/collab/comments/:id
// @access Private (owner only)
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();
    return res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
