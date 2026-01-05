import Doctor from "../models/doctor.model.js";

export async function listDoctors(req, res, next) {
  try {
    const docs = await Doctor.find().lean();
    res.status(200).json(docs);
  } catch (err) {
    next(err);
  }
}

export async function createDoctor(req, res, next) {
  try {
    const { name, specialty } = req.body;
    const created = await Doctor.create({ name, specialty });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}
