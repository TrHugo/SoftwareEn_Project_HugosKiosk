import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import { connectDb } from "./db.js"; 

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
