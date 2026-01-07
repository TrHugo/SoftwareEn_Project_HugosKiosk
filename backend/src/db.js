import mongoose from "mongoose";
import fs from "fs/promises";
import Article from "./models/article.model.js";

const MONGO_URI = "mongodb+srv://LaThoms:Louvres123@hugoskiosk.elv86h7.mongodb.net/";

export async function connectDb() {
  try {
    
    
    await mongoose.connect(MONGO_URI);
    console.log("[db] Connecté à MongoDB Atlas via Mongoose");

    const data = await fs.readFile("./data/articles.json", "utf-8");
    const articles = JSON.parse(data);

    const count = await Article.countDocuments();
    if (count === 0) {
      await Article.insertMany(articles);
      console.log("[db] Données de articles.json importées avec succès");
    } else {
      console.log(`[db] La base contient déjà ${count} articles. Pas d'importation nécessaire.`);
    }

  } catch (err) {
    console.error("[db startup error]", err);

    throw err; 
  }
}