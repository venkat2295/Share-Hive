import express from "express";
const router = express.Router();
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
  getUserPosts,  // New controller
} from "../controllers/postControllers";
import { authGuard, adminGuard } from "../middleware/authMiddleware";

// Modified routes
router.route("/")
  .post(authGuard, createPost)  // Removed adminGuard
  .get(getAllPosts);

router.route("/:slug")
  .put(authGuard, updatePost)  // Removed adminGuard
  .delete(authGuard, deletePost)  // Keep authGuard for deletion
  .get(getPost);

// New route for user dashboard
router.get("/user", authGuard, getUserPosts);

// Admin-only routes
router.get("/admin/all", authGuard, adminGuard, getAllPosts);

export default router;