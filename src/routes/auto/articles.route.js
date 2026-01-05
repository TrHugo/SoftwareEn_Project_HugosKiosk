import express from "express";
import { listArticles, createArticle } from "../../controllers/article.controller.js";

const router = express.Router();

router.get("/articles", listArticles);
router.post("/articles", createArticle);

export default router;