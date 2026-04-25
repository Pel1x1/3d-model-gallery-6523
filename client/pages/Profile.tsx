import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Upload, User, Mail, FileUp, Loader, X } from "lucide-react";
import { UploadModelResponse } from "@shared/api";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
  });

  const [modelFile, setModelFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [modelPreview, setModelPreview] = useState<string>("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleModelFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setModelFile(file);
      setModelPreview(file.name);
    }
  };

  const handleThumbnailFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeModelFile = () => {
    setModelFile(null);
    setModelPreview("");
  };

  const removeThumbnailFile = () => {
    setThumbnailFile(null);
    setThumbnailPreview("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Название и описание обязательны");
      return;
    }

    if (!modelFile) {
      setError("Выберите файл модели");
      return;
    }

    try {
      setUploading(true);

      // In a real app, you would upload files to a storage service
      // For now, we'll create object URLs
      const modelUrl = URL.createObjectURL(modelFile);
      const thumbnailUrl = thumbnailPreview || "/placeholder.svg";

      const payload = {
        title: formData.title,
        description: formData.description,
        fileUrl: modelUrl,
        thumbnailUrl: thumbnailUrl,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      const response = await fetch("/api/models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Ошибка при загрузке модели");
      }

      const data = (await response.json()) as UploadModelResponse;

      if (data.success) {
        setSuccess(true);
        setFormData({
          title: "",
          description: "",
          tags: "",
        });
        setModelFile(null);
        setModelPreview("");
        setThumbnailFile(null);
        setThumbnailPreview("");

        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Неизвестная ошибка при загрузке"
      );
      console.error("Error uploading model:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className="mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full mb-6">
            <User size={16} className="text-secondary" />
            <span className="text-sm font-medium text-secondary">
              Управление профилем
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Ваш{" "}
            <span className="text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
              Профиль
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl">
            Загружайте свои 3D модели и делитесь ими с сообществом
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Profile Info */}
          <div className="animate-slide-in-from-left">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Информация профиля
              </h2>

              <div className="space-y-6">
                <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">
                        Вы вошли как:
                      </p>
                      <p className="text-xl font-bold text-foreground mb-1">
                        {user?.name}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail size={16} />
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Здесь вы можете загружать и управлять своими 3D моделями
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Form */}
          <div className="animate-slide-in-from-left" style={{ animationDelay: "100ms" }}>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <FileUp size={24} className="text-secondary" />
                Загрузить модель
              </h2>

              {success && (
                <div className="mb-6 bg-primary/10 border border-primary/20 rounded-lg p-4 animate-fade-in">
                  <p className="text-primary font-medium">
                    ✓ Модель успешно загружена!
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-6 bg-destructive/10 border border-destructive/20 rounded-lg p-4 animate-fade-in">
                  <p className="text-destructive font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Название модели *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Введите название модели"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                    disabled={uploading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Описание *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Описание вашей модели"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                    disabled={uploading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    3D Файл модели * (GLB, GLTF, OBJ, FBX)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".glb,.gltf,.obj,.fbx"
                      onChange={handleModelFileChange}
                      disabled={uploading}
                      className="hidden"
                      id="model-file"
                    />
                    {modelFile ? (
                      <div className="w-full px-4 py-3 rounded-lg border border-primary bg-primary/5 text-foreground flex items-center justify-between">
                        <span className="text-sm font-medium truncate">
                          ✓ {modelPreview}
                        </span>
                        <button
                          type="button"
                          onClick={removeModelFile}
                          disabled={uploading}
                          className="text-destructive hover:text-red-600 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="model-file"
                        className="w-full px-4 py-3 rounded-lg border-2 border-dashed border-border bg-white text-muted-foreground cursor-pointer hover:border-primary hover:bg-primary/5 transition-all text-center"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Upload size={20} />
                          <span>Кликните для выбора файла</span>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Изображение превью (опционально)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailFileChange}
                      disabled={uploading}
                      className="hidden"
                      id="thumbnail-file"
                    />
                    {thumbnailPreview ? (
                      <div className="space-y-3">
                        <img
                          src={thumbnailPreview}
                          alt="Preview"
                          className="w-full h-40 object-cover rounded-lg border border-border"
                        />
                        <button
                          type="button"
                          onClick={removeThumbnailFile}
                          disabled={uploading}
                          className="w-full py-2 text-destructive hover:text-red-600 transition-colors font-medium"
                        >
                          Удалить превью
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="thumbnail-file"
                        className="w-full px-4 py-8 rounded-lg border-2 border-dashed border-border bg-white text-muted-foreground cursor-pointer hover:border-secondary hover:bg-secondary/5 transition-all text-center"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Upload size={24} />
                          <span className="font-medium">
                            Кликните для выбора изображения
                          </span>
                          <span className="text-xs">Рекомендуемый размер 500x300px</span>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Теги (через запятую)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="3D, персонаж, анимация"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                    disabled={uploading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                    uploading
                      ? "bg-muted text-muted-foreground cursor-not-allowed opacity-70"
                      : "btn-primary"
                  }`}
                >
                  {uploading ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      Загружаю...
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      Загрузить модель
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 p-4 bg-secondary/10 rounded-lg">
                <p className="text-xs text-muted-foreground mb-3 font-medium">
                  Поддерживаемые форматы:
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• GLB (рекомендуется)</li>
                  <li>• GLTF</li>
                  <li>• OBJ</li>
                  <li>• FBX</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
