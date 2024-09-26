import { Schema, model } from "mongoose";

const PostCategoriesSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    parent: { type: Schema.Types.ObjectId, ref: "PostCategories", default: null },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

PostCategoriesSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "categories",
});

// Index for faster querying
PostCategoriesSchema.index({ slug: 1 });

const PostCategories = model("PostCategories", PostCategoriesSchema);
export default PostCategories;