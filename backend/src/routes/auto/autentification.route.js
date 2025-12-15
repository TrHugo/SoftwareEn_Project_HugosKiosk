import { login } from '../../utils/JetonCreation.js';
import { Router } from "express";

const router = Router();
router.post('/login', login)
export default router;
