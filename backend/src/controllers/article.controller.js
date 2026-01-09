import Article from "../models/article.model.js";

// --- FONCTIONS EXISTANTES (MODIFIÉES LÉGÈREMENT POUR UNIFORMISATION) ---

export async function getArticleById(articleId) {
  try {
    // Note: On utilise ton champ custom "id", pas le "_id" de Mongo
    const article = await Article.findOne({ id: articleId }).lean();
    return article;
  } catch (err) {
    if (err.name === "CastError") return null;
    throw err;
  } 
}

export async function getArticlesNameAndIDByPublisher(publisherId) {
  try {
    const articles = await Article.find({ publisher: publisherId }, 'title _id id').lean();
    return articles;
  } catch (err) {
    throw err;
  } 
};

export async function createArticle(req, res, next) {
  try {
    const { publisher, title, content } = req.body;
    
    // Validation basique
    if (!publisher || !title || !content) {
      return res.status(400).json({ error: "All fields are required." });
    }
    
    // Gestion de l'incrémentation de l'ID custom
    const lastArticle = await Article.findOne().sort({ id: -1 });
    const id = lastArticle ? lastArticle.id + 1 : 1;

    // Création
    const created = await Article.create({ id, publisher, title, content, active: true });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

export async function listArticles(req, res, next) {
  try {
    const articles = await Article.find().lean();
    res.status(200).json(articles);
  } catch (err) {
    next(err);
  }
};

// --- NOUVELLES FONCTIONS POUR LE SITE PUBLIC ---

/**
 * Récupère les 6 derniers articles actifs pour la page d'accueil
 */
export async function getLatestPublicArticles(req, res, next) {
  try {
    const articles = await Article.find({ active: true }) // Filtre: seulement les actifs
      .sort({ createdAt: -1 }) // Tri: Du plus récent au plus vieux
      .limit(6) // Limite: 6 articles
      .lean();
      
    res.status(200).json(articles);
  } catch (err) {
    next(err);
  }
}

/**
 * Recherche des articles par titre
 * Utilisation: /api/search?q=monRecherche
 */
export async function searchArticles(req, res, next) {
  try {
    const query = req.query.q; // On récupère le mot tapé dans l'URL
    
    // Si la recherche est vide, on renvoie une liste vide
    if (!query) {
      return res.status(200).json([]);
    }

    const articles = await Article.find({ 
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } }
      ],
      active: true 
    })
    .sort({ createdAt: -1 }) 
    .lean();

    res.status(200).json(articles);
  } catch (err) {
    next(err);
  }
}