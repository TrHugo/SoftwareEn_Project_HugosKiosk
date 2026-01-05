/**
 * App entrypoint.
 * We keep the HTTP listener separate from the Express app instance so
 * tests can import `app` without opening a real port.
 */
/**
 * App entrypoint.
 * Le serveur n'écoute le port que si la connexion DB est réussie.
 */
import app from "./app.js";
import mongoose from "mongoose";
import {connectDb} from "./db.js"; 

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    
    await connectDb();

  
    app.listen(PORT, () => {
      console.log(`[server] listening on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("[critical error] Impossible de démarrer l'application:", err);
    process.exit(1);
  }
}

start();