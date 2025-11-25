import express from 'express';

const router = express.Router();
router.get('/article/:articleId', (req, res) => {
    
    const articleId = parseInt(req.params.articleId);
    const article = user.articles.find(a => a.id === articleId);

    if (article) {

        // 
    res.json({
            success: true,
            article: article
        });
    }
    else{
        // Faire la gestion d'erreur
    }


})