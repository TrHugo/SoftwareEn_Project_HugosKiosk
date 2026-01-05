/**
 * App entrypoint.
 * We keep the HTTP listener separate from the Express app instance so
 * tests can import `app` without opening a real port.
 */

import app from "./app.js";
import { connectToDb } from "./db/mongo.js";

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    // Connect DB first
    await connectToDb();
    console.log("[db] connected");

    // Start server once DB is OK
    app.listen(PORT, () => {
      console.log(`[server] listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("[startup error]", err);
    process.exit(1);
  }
}

start();