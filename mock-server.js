import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import "dotenv/config";
import initRoutes from "./src/routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
global.appRootDir = __dirname;

const app = express();

app.use(express.static(path.join(__dirname, "public")));

(async () => {
  try {
    /* ---------- 1. Connect infrastructure ---------- */
    // redisClient;
    // esClient;

    /* ---------- 2. Set up Express ---------- */
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    // app.use(monitoringMiddleware.execution);

    // Health-check endpoint
    app.get("/health", (_req, res) => res.json({ status: "ok" }));

    await initRoutes("/mock-api", app);

    console.log("✅ Root route registered");
    // Root route
    app.get("/", (_req, res) => res.send("MOCK-API-SERVER [0.0.8]"));

    // 404 handler
    app.use((_req, _res, next) => {
      const err = new Error("Not Found");
      err.status = 404;
      next(err);
    });

    // Central error handler
    // app.use(responseMiddleware.error);

    /* ---------- 4. Start the server ---------- */
    const PORT = Number(process.env.MOCK_PORT) || 5001;
    app.listen(PORT, () => {
      console.log(`\u2728 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("\u274C Startup failed:", err);
    process.exit(1);
  }
})();
