import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    // Initialize demo user if no users exist
    const existingUsers = localStorage.getItem("users");
    if (!existingUsers) {
      const demoUsers = [
        {
          id: "demo_user_1",
          email: "demo@example.com",
          password: "123456",
          name: "Demo User",
        },
      ];
      localStorage.setItem("users", JSON.stringify(demoUsers));
    }

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error loading user from localStorage:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Validate input
    if (!email || !password) {
      throw new Error("Электронная почта и пароль обязательны");
    }

    if (!email.includes("@")) {
      throw new Error("Введите корректный адрес электронной почты");
    }

    if (password.length < 6) {
      throw new Error("Пароль должен содержать минимум 6 символов");
    }

    // Check if user exists in localStorage (simple demo)
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (!foundUser) {
      throw new Error("Неверная электронная почта или пароль");
    }

    const newUser: User = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
    };

    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const register = async (email: string, password: string, name: string) => {
    // Validate input
    if (!email || !password || !name) {
      throw new Error("Все поля обязательны");
    }

    if (!email.includes("@")) {
      throw new Error("Введите корректный адрес электронной почты");
    }

    if (password.length < 6) {
      throw new Error("Пароль должен содержать минимум 6 символов");
    }

    if (name.length < 2) {
      throw new Error("Имя должно содержать минимум 2 символа");
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some((u: any) => u.email === email)) {
      throw new Error("Пользователь с этой электронной почтой уже существует");
    }

    // Create new user
    const newUserId = `user_${Date.now()}`;
    const newUserData = {
      id: newUserId,
      email,
      password, // In a real app, this should be hashed
      name,
    };

    users.push(newUserData);
    localStorage.setItem("users", JSON.stringify(users));

    const newUser: User = {
      id: newUserId,
      email,
      name,
    };

    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
