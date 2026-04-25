import { Link } from "react-router-dom";
import { Home, User, Menu, X } from "lucide-react";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-bold text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text hover:scale-105 transition-transform"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">3D</span>
              </div>
              ModelHub
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium"
              >
                <Home size={20} />
                Каталог
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium"
              >
                <User size={20} />
                Профиль
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
              onClick={toggleMenu}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {menuOpen && (
            <nav className="md:hidden mt-4 flex flex-col gap-4 pb-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium px-4 py-2"
                onClick={() => setMenuOpen(false)}
              >
                <Home size={20} />
                Каталог
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium px-4 py-2"
                onClick={() => setMenuOpen(false)}
              >
                <User size={20} />
                Профиль
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white/40 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">ModelHub</h3>
              <p className="text-muted-foreground text-sm">
                Платформа для просмотра и обмена 3D моделями
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Навигация</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/" className="hover:text-primary transition-colors">
                    Каталог
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="hover:text-primary transition-colors"
                  >
                    Профиль
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">О сайте</h4>
              <p className="text-muted-foreground text-sm">
                Создано с помощью React, Vite и Tailwind CSS
              </p>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
            <p>
              © 2024 ModelHub. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
