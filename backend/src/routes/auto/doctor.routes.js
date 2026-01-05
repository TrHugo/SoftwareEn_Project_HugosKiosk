import express from "express";
import { listDoctors, createDoctor } from "../controllers/doctor.controller.js";

const router = express.Router();

router.get("/", listDoctors);
router.post("/", createDoctor);

export default router;
