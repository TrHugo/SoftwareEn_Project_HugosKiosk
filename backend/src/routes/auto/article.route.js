import { checkUser, CheckSubsription } from '../../utils/JetonVerification.js';
import { 
  getArticleById, 
  createArticle, 
  listArticles, 
  getLatestPublicArticles, 
  searchArticles 
} from "../../controllers/article.controller.js";
import { Router } from "express";

const router = Router();

router.get('/latest', getLatestPublicArticles);

router.get('/search', searchArticles);

router.get('/read/:articleId', checkUser, CheckSubsription, async (req, res, next) => {
    try {
        const articleId = req.params.articleId;

        if (isNaN(articleId)) {
            const err = new Error("Article ID incorrect (must be a number)");
            err.status = 400;   
            return next(err);
        }

        const article = await getArticleById(articleId);

        if (article) {
            res.status(200).json(article);
        } else {
            const err = new Error("Article not found");
            err.status = 404;
            return next(err);
        }
    } catch (err) {
        next(err);
    }
});

router.post('/article', checkUser, createArticle);

router.get('/articles', listArticles);

router.get('/article/:articleId', checkUser, async (req, res, next) => {
    try {
        const articleId = req.params.articleId;
        if (isNaN(articleId)) {
            const err = new Error("Invalid ID");
            err.status = 400;
            return next(err);
        }
        const article = await getArticleById(articleId);
        if (article) res.status(200).json({ success: true, article });
        else res.status(404).json({ message: "No Article found" });
    } catch(e) { next(e); }
});

export default router;
