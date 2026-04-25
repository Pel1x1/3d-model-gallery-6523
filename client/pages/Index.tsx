import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ModelsResponse, Model } from "@shared/api";
import { Sparkles, Zap } from "lucide-react";

export default function Index() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/models");
      const data = (await response.json()) as ModelsResponse;
      setModels(data.models);
    } catch (err) {
      setError("Ошибка при загрузке моделей");
      console.error("Error fetching models:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="mb-20 animate-fade-in">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <Sparkles size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">
              Добро пожаловать в ModelHub
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Каталог{" "}
            <span className="text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
              3D Моделей
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Исследуйте потрясающую коллекцию трехмерных моделей. Просматривайте,
            загружайте свои модели и делитесь ими с сообществом.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">
              <Sparkles className="inline mr-2" size={20} />
              Исследовать каталог
            </button>
            <Link
              to="/profile"
              className="px-6 py-3 rounded-lg border border-border hover:bg-muted transition-all duration-200 font-semibold flex items-center justify-center gap-2"
            >
              <Zap size={20} />
              Загрузить модель
            </Link>
          </div>
        </div>
      </section>

      {/* Models Grid */}
      <section className="mb-20">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-3">
            Популярные модели
          </h2>
          <p className="text-lg text-muted-foreground">
            Выберите интересующую вас модель для просмотра
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin">
              <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
            <p className="text-destructive font-medium">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {models.map((model, index) => (
              <Link
                key={model.id}
                to={`/model/${model.id}`}
                className="group animate-fade-in-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="bg-white rounded-xl overflow-hidden card-hover shadow-sm">
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
                    <img
                      src={model.thumbnailUrl}
                      alt={model.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {model.title}
                    </h3>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {model.description}
                    </p>

                    {/* Tags */}
                    {model.tags && model.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {model.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                        {model.tags.length > 2 && (
                          <span className="text-xs px-3 py-1 bg-muted text-muted-foreground rounded-full font-medium">
                            +{model.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-border pt-4">
                      <span>{model.author}</span>
                      <span>
                        {new Date(model.createdAt).toLocaleDateString("ru-RU")}
                      </span>
                    </div>
                  </div>

                  {/* Hover Button */}
                  <div className="px-6 pb-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-full btn-primary text-sm py-2">
                      Просмотреть 3D
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
