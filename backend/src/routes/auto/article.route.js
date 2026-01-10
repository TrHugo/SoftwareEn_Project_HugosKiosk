import { checkUser } from '../../utils/JetonVerification.js';
import { 
  getArticleById, 
  createArticle, 
  listArticles, 
  getLatestPublicArticles, 
  searchArticles 
} from "../../controllers/article.controller.js";
import { Router } from "express";

const router = Router();

// ==========================================
// ROUTES PUBLIQUES (Lecture seule)
// ==========================================

// 1. Récupérer les 6 derniers articles (Page d'accueil)
// URL: GET /api/latest
router.get('/latest', getLatestPublicArticles);

// 2. Recherche d'articles
// URL: GET /api/search?q=motcle
router.get('/search',  searchArticles);

// 3. Lire un article spécifique (Lecture publique)
// URL: GET /api/read/:articleId
// Note: J'ai changé le path en '/read/:id' pour éviter les conflits, 
// ou on peut utiliser '/:articleId' si on le place à la fin.
router.get('/read/:articleId', checkUser, async (req, res, next) => {
    try {
        const articleId = req.params.articleId;

        // Vérification si c'est un nombre (car ton système utilise des ID numériques custom)
        if (isNaN(articleId)) {
            const err = new Error("Article ID incorrect (must be a number)");
            err.status = 400;   
            return next(err);
        }

        const article = await getArticleById(articleId);

        if (article) {
            res.status(200).json(article); // On renvoie l'objet direct pour simplifier le front
        } else {
            const err = new Error("Article not found");
            err.status = 404;
            return next(err);
        }
    } catch (err) {
        next(err);
    }
});


// ==========================================
// ROUTES PROTEGEES (Admin / Création)
// ==========================================

// Créer un article (Nécessite d'être connecté)
// URL: POST /api/article
router.post('/article', checkUser, createArticle);

// Lister tous les articles (Admin view ?)
router.get('/articles', listArticles);

// Ta route existante (peut-être pour l'édition future ?)
router.get('/article/:articleId', checkUser, async (req, res, next) => {
    // ... ta logique existante avec checkUser ...
    // Je l'ai laissée telle quelle si tu as besoin de vérifier les droits 
    // avant de renvoyer l'article (ex: pour voir les articles non-actifs)
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