// server/models/model.ts

import mongoose, { Schema, Document } from "mongoose";

// Интерфейс модели данных
export interface IModel extends Document {
  title: string;
  description: string;
  author: string;
  fileUrl: string;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

// Схема модели данных
const ModelSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, required: true },
  fileUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  createdAt: { type: String, default: new Date().toISOString() },
  updatedAt: { type: String, default: new Date().toISOString() },
  tags: { type: [String], default: [] },
});

// Экспортируем модель
export const Model = mongoose.model<IModel>("Model", ModelSchema);