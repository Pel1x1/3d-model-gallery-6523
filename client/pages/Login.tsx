import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LogIn, Mail, Lock } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await login(formData.email, formData.password);
      navigate("/profile");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ошибка при входе в аккаунт"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg mb-6">
            <LogIn size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Вход</h1>
          <p className="text-muted-foreground">
            Войдите в свой аккаунт ModelHub
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-destructive/10 border border-destructive/20 rounded-lg p-4 animate-fade-in">
            <p className="text-destructive font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Mail className="inline mr-2" size={16} />
              Электронная почта
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Lock className="inline mr-2" size={16} />
              Пароль
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Минимум 6 символов"
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              loading
                ? "bg-muted text-muted-foreground cursor-not-allowed opacity-70"
                : "btn-primary"
            }`}
          >
            {loading ? "Входим..." : "Войти в аккаунт"}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
          <p className="text-xs text-muted-foreground font-medium mb-2">
            Демо учетные данные:
          </p>
          <p className="text-xs text-foreground mb-1">
            <strong>Email:</strong> demo@example.com
          </p>
          <p className="text-xs text-foreground">
            <strong>Пароль:</strong> 123456
          </p>
        </div>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Нет аккаунта?{" "}
            <Link
              to="/register"
              className="text-primary font-semibold hover:text-secondary transition-colors"
            >
              Зарегистрируйтесь
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}
