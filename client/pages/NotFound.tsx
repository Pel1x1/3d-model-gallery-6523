import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex items-center justify-center py-32">
        <div className="text-center max-w-md animate-fade-in">
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 bg-destructive/10 rounded-full">
            <AlertCircle size={40} className="text-destructive" />
          </div>

          <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>

          <p className="text-2xl font-semibold text-foreground mb-3">
            Страница не найдена
          </p>

          <p className="text-muted-foreground text-base mb-8">
            К сожалению, страница, которую вы ищете, не существует. Проверьте
            URL и попробуйте снова.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 btn-primary text-lg"
          >
            <Home size={20} />
            Вернуться на главную
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
