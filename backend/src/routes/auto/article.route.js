import { checkUser} from '../../utils/JetonVerification.js';
import { getArticleById } from "../../controllers/article.controller.js";
import { Router } from "express";

const router = Router();

router.get('/article/:articleId',checkUser, async (req, res, next) => {
    try {
        const articleId = req.params.articleId;

        if (isNaN(articleId)) {
        const err = new Error("Article ID incorrect");
        err.status = 400;   
        return next(err);
        }

        const article = await getArticleById(articleId);

        if (article) {
            res.status(200).json({
                success: true,
                article: article
            });
        } else {
            const err = new Error("Article not found found");
            err.status = 404;
            return next(err);
        }
    } catch (err) {
        next(err);
    }
});

export default router;
