import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { postsRouter } from "./routes/post-routes.js";
import userRouter from "./routes/user-routes.js";
import commentRouter from "./routes/comment-routes.js";
import mongoose from 'mongoose'; // Import mongoose
import { env } from "./settings/envs.js";

const app = express();

// middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());

// app.use(validatePost);

app.use("/api/posts", postsRouter); // Adjusted path for consistency
app.use("/api/users", userRouter);
// Mount the comment router. It will handle routes like /api/posts/:postId/comments
app.use("/api/posts/:postId/comments", commentRouter);

// MongoDB Connection
mongoose.connect(env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
