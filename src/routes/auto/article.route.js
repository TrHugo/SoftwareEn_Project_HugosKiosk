import { Router } from "express";
import { articles } from "../utils/constant.js";

const router = express.Router();


router.get('/article/:articleId', (req, res, next) => {
    const articleId = parseInt(req.params.articleId, 10);

    if (isNaN(articleId)) {
        const err = new Error("ID error");
        err.status = 400;   //A verifier
        return next(err);
    }
    
    const article = articles.find(a => a.id === articleId);

    if (article) {
        res.json({
            success: true,
            article: article
        });
    } else {
        const err = new Error("No Article found");
        err.status = 500; //A verifier
        return next(err);
    }
});

export default router;