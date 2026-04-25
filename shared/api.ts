/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * 3D Model type
 */
export interface Model {
  id: string;
  title: string;
  description: string;
  author: string;
  fileUrl: string;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface ModelsResponse {
  models: Model[];
}

export interface ModelDetailResponse {
  model: Model;
}

export interface UploadModelResponse {
  success: boolean;
  modelId: string;
  message: string;
}

export interface ModelViewerDataResponse {
  modelData: string;
  format: string;
  size: number;
}
