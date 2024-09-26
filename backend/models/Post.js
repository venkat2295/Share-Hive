import { Schema, model } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    caption: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    body: { type: Object, required: true },
    photo: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    tags: { type: [String] },
    categories: [{ type: Schema.Types.ObjectId, ref: "PostCategories" }],
    lastEditedAt: { type: Date },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

PostSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
});

// Indexes for performance
PostSchema.index({ user: 1, createdAt: -1 });
PostSchema.index({ title: 'text' });

const Post = model("Post", PostSchema);

export default Post;