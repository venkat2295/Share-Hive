import express from "express";
const router = express.Router();
import {
  createComment,
  deleteComment,
  getAllComments,
  updateComment,
  getUserComments,  // New controller
} from "../controllers/commentControllers";
import { adminGuard, authGuard } from "../middleware/authMiddleware";

// Existing routes
router
  .route("/")
  .post(authGuard, createComment)
  .get(authGuard, adminGuard, getAllComments);

router
  .route("/:commentId")
  .put(authGuard, updateComment)
  .delete(authGuard, deleteComment);

// New route for user dashboard
router.get("/user", authGuard, getUserComments);

export default router;