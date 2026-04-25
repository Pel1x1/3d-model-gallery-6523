// server/db.ts

import mongoose from "mongoose";

// Функция для подключения к базе данных MongoDB
export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/modelsDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1); // Завершаем приложение, если не удалось подключиться
  }
};