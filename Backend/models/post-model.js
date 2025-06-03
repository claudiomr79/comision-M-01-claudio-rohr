import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"],
  },
  desc: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"],
  },
  image: {
    type: String,
    required: [true, "Image URL is required"],
    match: [/^https?:\/\/.+/, "Please enter a valid URL"],
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Post must have an author"],
  },
  comments: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Comment",
    },
  ],
  likes: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  location: {
    type: String,
    trim: true,
  },
  tags: [String],
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
postSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Populate author and comments when finding
postSchema.pre(/^find/, function (next) {
  this.populate({
    path: "author",
    select: "name email avatar",
  }).populate({
    path: "comments",
    populate: {
      path: "author",
      select: "name email avatar",
    },
  });
  next();
});

export default mongoose.model("Post", postSchema);
