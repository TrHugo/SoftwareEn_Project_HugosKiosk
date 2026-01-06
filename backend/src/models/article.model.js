import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    publisher_id: { type: String, required: true },
    title: { type: Boolean, required: true },
    content: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Article", articleSchema, "Articles");