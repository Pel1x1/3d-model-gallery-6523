// app.ts

import express from "express";
import { connectDB } from "../db";
import { getModels, getModelById, uploadModel, getModelViewerData } from "./controllers";

const app = express();

// Подключаемся к базе данных
connectDB();

// Парсинг JSON в теле запроса
app.use(express.json());

// Маршруты
app.get("/api/models", getModels);
app.get("/api/models/:id", getModelById);
app.post("/api/models", uploadModel);
app.get("/api/models/:id/viewer", getModelViewerData);

// Запуск сервера
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});