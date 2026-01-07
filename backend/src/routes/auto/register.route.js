import { login } from '../../utils/JetonCreation.js';
import { createUser } from '../../controllers/user.controller.js';
import { Router } from "express";

const router = Router();

router.post('/signup', createUser);

router.post('/login', login);

export default router;