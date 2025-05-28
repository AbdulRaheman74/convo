import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  author: {  // ✅ Corrected spelling
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // Make sure your User model is exported as "User"
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Post", // Conventionally capitalized
  },
}, { timestamps: true });

export const Comment = mongoose.model("Comment", commentSchema);