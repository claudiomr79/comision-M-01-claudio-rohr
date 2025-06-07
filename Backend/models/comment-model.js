const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Comment content is required"],
    trim: true,
    maxlength: [300, "Comment cannot exceed 300 characters"],
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Comment must have an author"],
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: "Post",
    required: [true, "Comment must belong to a post"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
commentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Populate author when finding
commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "author",
    select: "name email avatar",
  });
  next();
});

module.exports = mongoose.model("Comment", commentSchema);
