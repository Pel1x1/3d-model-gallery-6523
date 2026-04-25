// server/index.ts

import express from "express";
import { connectDB } from "./db";  // Подключение к базе данных
import { getModels, getModelById, uploadModel, getModelViewerData } from "./routes/models";  // Путь к обработчикам маршрутов
import path from "node:path";

// Создание и настройка сервера
export const createServer = () => {
  const app = express();

  // Подключаемся к базе данных
  connectDB();

  // Парсинг JSON в теле запроса
  app.use(express.json());

  // API маршруты
  app.get("/api/models", getModels);
  app.get("/api/models/:id", getModelById);
  app.post("/api/models", uploadModel);
  app.get("/api/models/:id/viewer", getModelViewerData);

  // Включаем статические файлы для фронтенда
  const distPath = path.join(__dirname, "../spa");
  app.use(express.static(distPath));

  // Обработка всех остальных маршрутов для SPA
  app.get("*", (req, res) => {  // Это будет работать для всех путей, кроме API
    if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
      return res.status(404).json({ error: "API endpoint not found" });
    }
    res.sendFile(path.join(distPath, "index.html"));
  });

  return app;
};

// Экспортируем createServer