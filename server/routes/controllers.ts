// controllers.ts

import { RequestHandler } from "express";
import { Model } from "../models/model"; // Модель из файла model.ts
import { ModelsResponse, ModelDetailResponse, UploadModelResponse, ModelViewerDataResponse } from "@shared/api";

// Получение всех моделей
export const getModels: RequestHandler = async (_req, res) => {
  try {
    const models = await Model.find();
    const response: ModelsResponse = {
      models,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch models" });
  }
};

// Получение конкретной модели по ID
export const getModelById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const model = await Model.findById(id);

    if (!model) {
      res.status(404).json({ error: "Model not found" });
      return;
    }

    const response: ModelDetailResponse = {
      model,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the model" });
  }
};

// Загрузка новой модели
export const uploadModel: RequestHandler = async (req, res) => {
  const { title, description, fileUrl, thumbnailUrl, tags } = req.body;

  if (!title || !description) {
    res.status(400).json({ error: "Title and description are required" });
    return;
  }

  try {
    const newModel = new Model({
      title,
      description,
      author: "Current User",
      fileUrl: fileUrl || "/models/default.glb",
      thumbnailUrl: thumbnailUrl || "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=500&h=300&fit=crop",
      tags: tags || [],
    });

    await newModel.save();

    const response: UploadModelResponse = {
      success: true,
      modelId: newModel.id,
      message: "Model uploaded successfully",
    };
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to upload model" });
  }
};

// Получение данных для 3D визуализатора
export const getModelViewerData: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const model = await Model.findById(id);

    if (!model) {
      res.status(404).json({ error: "Model not found" });
      return;
    }

    const response: ModelViewerDataResponse = {
      modelData: model.fileUrl,
      format: "glb",
      size: 2048, // в байтах
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch viewer data" });
  }
};