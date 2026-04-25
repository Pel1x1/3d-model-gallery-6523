import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Upload, User, Mail, FileUp, Loader } from "lucide-react";
import { UploadModelResponse } from "@shared/api";

export default function Profile() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fileUrl: "",
    thumbnailUrl: "",
    tags: "",
  });

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Название и описание обязательны");
      return;
    }

    try {
      setUploading(true);

      const payload = {
        title: formData.title,
        description: formData.description,
        fileUrl: formData.fileUrl || "/models/default.glb",
        thumbnailUrl: formData.thumbnailUrl || undefined,
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
          fileUrl: "",
          thumbnailUrl: "",
          tags: "",
        });

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
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    <User className="inline mr-2" size={18} />
                    Имя пользователя
                  </label>
                  <input
                    type="text"
                    value="Текущий пользователь"
                    disabled
                    className="w-full px-4 py-3 bg-muted rounded-lg border border-border text-foreground opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    <Mail className="inline mr-2" size={18} />
                    Email
                  </label>
                  <input
                    type="email"
                    value="user@example.com"
                    disabled
                    className="w-full px-4 py-3 bg-muted rounded-lg border border-border text-foreground opacity-60"
                  />
                </div>

                <div className="pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4">
                    Функция аутентификации будет добавлена в будущем обновлении
                  </p>
                  <button
                    disabled
                    className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold opacity-60 cursor-not-allowed"
                  >
                    Сохранить изменения
                  </button>
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
                    URL файла модели
                  </label>
                  <input
                    type="url"
                    name="fileUrl"
                    value={formData.fileUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/model.glb"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                    disabled={uploading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    URL изображения превью
                  </label>
                  <input
                    type="url"
                    name="thumbnailUrl"
                    value={formData.thumbnailUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/preview.jpg"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                    disabled={uploading}
                  />
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
