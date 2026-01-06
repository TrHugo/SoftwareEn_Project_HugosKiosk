import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    mdp: { type: String, required: true }, // to hash password
    role: { type: String, required: true, enum: ['user', 'publisher'], default: 'user' }
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema, "Users");