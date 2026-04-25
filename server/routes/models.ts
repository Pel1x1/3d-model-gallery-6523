import { RequestHandler } from "express";
import {
  ModelsResponse,
  ModelDetailResponse,
  UploadModelResponse,
  ModelViewerDataResponse,
  Model,
} from "@shared/api";

// In-memory storage for demo purposes
// In production, use a real database like PostgreSQL/MongoDB
let modelsStore: Model[] = [
  {
    id: "1",
    title: "Cube",
    description: "A simple 3D cube model with metallic material",
    author: "Demo User",
    fileUrl: "/models/cube.glb",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500&h=300&fit=crop",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ["cube", "geometric", "basic"],
  },
  {
    id: "2",
    title: "Sphere",
    description: "A perfectly smooth sphere with glass material",
    author: "Demo User",
    fileUrl: "/models/sphere.glb",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1557821552-17105176677c?w=500&h=300&fit=crop",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ["sphere", "geometric", "round"],
  },
  {
    id: "3",
    title: "Pyramid",
    description: "An Egyptian pyramid with stone texture",
    author: "Demo User",
    fileUrl: "/models/pyramid.glb",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1568630114967-ca7730d63b38?w=500&h=300&fit=crop",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ["pyramid", "architecture", "ancient"],
  },
  {
    id: "4",
    title: "Robot Arm",
    description: "A mechanical robot arm with articulated joints",
    author: "Demo User",
    fileUrl: "/models/robot.glb",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1485827404703-89b169773bef?w=500&h=300&fit=crop",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ["robot", "mechanical", "industrial"],
  },
  {
    id: "5",
    title: "Spaceship",
    description: "A futuristic spaceship design",
    author: "Demo User",
    fileUrl: "/models/spaceship.glb",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=500&h=300&fit=crop",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ["spaceship", "sci-fi", "futuristic"],
  },
  {
    id: "6",
    title: "Dragon",
    description: "A detailed fantasy dragon model",
    author: "Demo User",
    fileUrl: "/models/dragon.glb",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1562907550-2cbf17149edd?w=500&h=300&fit=crop",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ["dragon", "fantasy", "creature"],
  },
];

/**
 * GET /api/models - Get all models
 */
export const getModels: RequestHandler = (_req, res) => {
  const response: ModelsResponse = {
    models: modelsStore,
  };
  res.json(response);
};

/**
 * GET /api/models/:id - Get a specific model
 */
export const getModelById: RequestHandler = (req, res) => {
  const { id } = req.params;
  const model = modelsStore.find((m) => m.id === id);

  if (!model) {
    res.status(404).json({ error: "Model not found" });
    return;
  }

  const response: ModelDetailResponse = {
    model,
  };
  res.json(response);
};

/**
 * POST /api/models - Upload a new model
 */
export const uploadModel: RequestHandler = (req, res) => {
  const { title, description, fileUrl, thumbnailUrl } = req.body;

  if (!title || !description) {
    res.status(400).json({ error: "Title and description are required" });
    return;
  }

  const newModel: Model = {
    id: String(modelsStore.length + 1),
    title,
    description,
    author: "Current User",
    fileUrl: fileUrl || "/models/default.glb",
    thumbnailUrl:
      thumbnailUrl ||
      "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=500&h=300&fit=crop",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: req.body.tags || [],
  };

  modelsStore.push(newModel);

  const response: UploadModelResponse = {
    success: true,
    modelId: newModel.id,
    message: "Model uploaded successfully",
  };
  res.status(201).json(response);
};

/**
 * GET /api/models/:id/viewer - Get model viewer data (3D rendering on backend)
 */
export const getModelViewerData: RequestHandler = (req, res) => {
  const { id } = req.params;
  const model = modelsStore.find((m) => m.id === id);

  if (!model) {
    res.status(404).json({ error: "Model not found" });
    return;
  }

  // In a real app, this would process the 3D model on the backend
  // For now, we're just returning metadata for the frontend to render
  const response: ModelViewerDataResponse = {
    modelData: model.fileUrl,
    format: "glb",
    size: 2048, // In bytes, simulated
  };
  res.json(response);
};
