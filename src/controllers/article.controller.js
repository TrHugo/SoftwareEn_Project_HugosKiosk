import Article from "../models/article.model.js";

export async function listArticles(req, res, next) {
  try {
    const articles = await Article.find().lean();
    res.status(200).json(articles);
  } catch (err) {
    next(err);
  }
}

export async function createArticle(req, res, next) {
  try {
    const { id, publisher_id, title, content } = req.body;
    const created = await Article.create({ 
        id, 
        publisher_id, 
        title, 
        content 
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}