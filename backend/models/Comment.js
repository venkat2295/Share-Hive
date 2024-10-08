import { Schema, model } from "mongoose";

const CommentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    desc: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    postTitle: { type: String, required: true },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    replyOnUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    edited: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

CommentSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parent",
});

// Indexes for performance
CommentSchema.index({ user: 1, createdAt: -1 });
CommentSchema.index({ user: 1, post: 1 });

const Comment = model("Comment", CommentSchema);

export default Comment;