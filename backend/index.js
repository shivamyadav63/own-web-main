import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

console.log("✅ User routes loading...");
app.use("/api/users", userRouter);

console.log("✅ Post routes loading...");
app.use("/api/posts", postRouter);

app.get("/", (req, res) => {
  res.send("Social Media API Running...");
});

const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Error:", error);
  });