import { Router } from "express";
import { articles } from "../../utils/constant.js";
import { checkUser} from '../../utils/JetonVerification';

const router = express.Router();


router.get('/article/:articleId',checkUser, (req, res, next) => {
    const articleId = parseInt(req.params.articleId, 10);

    if (isNaN(articleId)) {
        const err = new Error("Article ID incorrect");
        err.status = 400;   //A verifier
        return next(err);
    }
    
    // A remplacer avec recherche dans database
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