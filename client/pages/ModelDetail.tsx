import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ModelViewer } from "@/components/ModelViewer";
import { ModelDetailResponse, Model } from "@shared/api";
import { ArrowLeft, Download, Share2, Calendar, User } from "lucide-react";

export default function ModelDetail() {
  const { id } = useParams<{ id: string }>();
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchModel();
    }
  }, [id]);

  const fetchModel = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/models/${id}`);
      if (!response.ok) {
        throw new Error("Model not found");
      }
      const data = (await response.json()) as ModelDetailResponse;
      setModel(data.model);
    } catch (err) {
      setError("Ошибка при загрузке модели");
      console.error("Error fetching model:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin">
            <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !model) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:text-secondary mb-8 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Вернуться к каталогу
          </Link>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-8 text-center">
            <p className="text-destructive font-medium text-lg">
              {error || "Модель не найдена"}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const handleDownload = () => {
    // In a real app, this would download the model file
    console.log("Download model:", model.fileUrl);
    window.open(model.fileUrl, "_blank");
  };

  const handleShare = () => {
    // In a real app, this would share the model
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: model.title,
        text: model.description,
        url: url,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      alert("Ссылка скопирована в буфер обмена!");
    }
  };

  return (
    <Layout>
      <div className="mb-8 animate-fade-in">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary hover:text-secondary font-medium transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Вернуться к каталогу
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 3D Viewer */}
          <div className="lg:col-span-2">
            <div className="h-96 md:h-[600px] rounded-xl overflow-hidden shadow-lg animate-scale-in">
              <ModelViewer modelUrl={model.fileUrl} title={model.title} />
            </div>
          </div>

          {/* Model Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-border animate-slide-in-from-left">
              <h1 className="text-3xl font-bold text-foreground mb-3">
                {model.title}
              </h1>

              <p className="text-muted-foreground text-base mb-6 leading-relaxed">
                {model.description}
              </p>

              {/* Meta Information */}
              <div className="space-y-4 border-t border-border pt-6">
                <div className="flex items-start gap-3">
                  <User size={20} className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Автор</p>
                    <p className="font-semibold text-foreground">
                      {model.author}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar
                    size={20}
                    className="text-primary mt-1 flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Дата создания
                    </p>
                    <p className="font-semibold text-foreground">
                      {new Date(model.createdAt).toLocaleDateString("ru-RU", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {model.tags && model.tags.length > 0 && (
                <div className="border-t border-border pt-6">
                  <p className="text-sm text-muted-foreground mb-3 font-medium">
                    Теги
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {model.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 border-t border-border pt-6 mt-6">
                <button
                  onClick={handleDownload}
                  className="w-full btn-primary text-base py-3"
                >
                  <Download className="inline mr-2" size={20} />
                  Скачать модель
                </button>
                <button
                  onClick={handleShare}
                  className="w-full border-2 border-secondary text-secondary font-semibold py-3 rounded-lg hover:bg-secondary/10 transition-all duration-200"
                >
                  <Share2 className="inline mr-2" size={20} />
                  Поделиться
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
