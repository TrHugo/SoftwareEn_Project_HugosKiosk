import express from "express";
import { listArticles, createArticle } from "../../controllers/article.controller.js";
import { checkUser,checkRole } from '../../utils/JetonVerification.js';
import { publisher_profile_access } from "../../utils/constant.js";

const router = express.Router();

router.get("/articles", checkUser,checkRole,listArticles);
router.post("/articles",checkRole(publisher_profile_access),createArticle);

export default router;