import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/database.js";

import { postsRouter } from "./routes/post-routes.js";
import { userRouter } from "./routes/user-routes.js";
import { commentRouter } from "./routes/comment-routes.js";

import { env } from "./settings/envs.js";

const app = express();

// Connect to MongoDB
connectDB();

// middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  })
);
app.use(helmet());

// Routes
app.use("/api/posts", postsRouter);
app.use("/api/users", userRouter);
app.use("/api/comments", commentRouter);

// For backward compatibility with frontend
app.use("/posts", postsRouter);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Travel Platform API is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.listen(env.PORT, () => {
  console.log(`🚀 Server running on port ${env.PORT}`);
  console.log(`📊 Health check: http://localhost:${env.PORT}/api/health`);
});
