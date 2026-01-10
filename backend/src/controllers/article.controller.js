import Article from "../models/article.model.js";

export async function getArticleById(articleId) {
  try {
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
    
    if (!publisher || !title || !content) {
      return res.status(400).json({ error: "All fields are required." });
    }
    
    const lastArticle = await Article.findOne().sort({ id: -1 });
    const id = lastArticle ? lastArticle.id + 1 : 1;

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

export async function getLatestPublicArticles(req, res, next) {
  try {
    const articles = await Article.find({ active: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();
      
    res.status(200).json(articles);
  } catch (err) {
    next(err);
  }
}

export async function searchArticles(req, res, next) {
  try {
    const query = req.query.q;
    
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
