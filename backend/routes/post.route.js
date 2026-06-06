import express from "express";
import {
  createPost,
  getAllPosts,
  likePost,
  addComment,
  deletePost,
} from "../controller/post.controller.js";

const router = express.Router();

router.post("/", createPost);
router.get("/", getAllPosts);
router.post("/:id/like", likePost);
router.post("/:id/comment", addComment);
router.delete("/:id", deletePost);

export default router;