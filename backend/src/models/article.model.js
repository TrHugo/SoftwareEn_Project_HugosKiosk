import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    publisher_id: { type: String, required: true },
    title: { type: Boolean, required: true },
    content: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Article", articleSchema, "Articles");