import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);
export default mongoose.model("Doctor", doctorSchema, "Doctors");
