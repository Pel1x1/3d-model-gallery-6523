import { Link, useNavigate } from "react-router-dom";
import { Home, User, Menu, X, LogOut, LogIn } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
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
              3D ModelHub
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
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium"
                  >
                    <User size={20} />
                    Профиль
                  </Link>
                  <div className="flex items-center gap-4 border-l border-border pl-8">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">
                        {user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-destructive hover:text-red-600 transition-colors font-medium"
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-primary hover:text-secondary transition-colors font-medium"
                >
                  <LogIn size={20} />
                  Вход
                </Link>
              )}
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
            <nav className="md:hidden mt-4 flex flex-col gap-2 pb-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium px-4 py-2 rounded-lg hover:bg-secondary/10"
                onClick={() => setMenuOpen(false)}
              >
                <Home size={20} />
                Каталог
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium px-4 py-2 rounded-lg hover:bg-secondary/10"
                    onClick={() => setMenuOpen(false)}
                  >
                    <User size={20} />
                    Профиль
                  </Link>
                  <div className="px-4 py-2 border-t border-border mt-2 pt-4">
                    <p className="text-sm font-semibold text-foreground mb-1">
                      {user?.name}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {user?.email}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-destructive hover:text-red-600 transition-colors font-medium w-full px-3 py-2 rounded-lg hover:bg-destructive/10"
                    >
                      <LogOut size={20} />
                      Выйти
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-primary hover:text-secondary transition-colors font-medium px-4 py-2 rounded-lg hover:bg-primary/10"
                  onClick={() => setMenuOpen(false)}
                >
                  <LogIn size={20} />
                  Вход
                </Link>
              )}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        {children}
      </main>

    </div>
  );
}
