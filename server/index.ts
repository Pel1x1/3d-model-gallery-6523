// server/index.ts

import express from "express";
import { connectDB } from "./db";
import { getModels, getModelById, uploadModel, getModelViewerData } from "./routes/models";
import path from "node:path";

export const createServer = () => {
  const app = express();
  connectDB();
  app.use(express.json());

  // API-маршруты
  app.get("/api/models", getModels);
  app.get("/api/models/:id", getModelById);
  app.post("/api/models", uploadModel);
  app.get("/api/models/:id/viewer", getModelViewerData);

  // Статические файлы фронтенда
  const distPath = path.join(__dirname, "../spa");
  app.use(express.static(distPath));

  // Обработка frontend-роутов: именованный wildcard
  app.get("/*splat", (req, res) => {
    // Исключаем API и другие служебные префиксы
    if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
      return res.status(404).json({ error: "API endpoint not found" });
    }
    res.sendFile(path.join(distPath, "index.html"));
  });

  return app;
};
