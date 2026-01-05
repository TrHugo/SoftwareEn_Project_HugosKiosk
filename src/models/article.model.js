import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true }, 
    
    publisher_id: { type: Number, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    
    
    active: { type: Boolean, default: true } 
  },
  { timestamps: true }
);
export default mongoose.model("Article", articleSchema, "Articles");
