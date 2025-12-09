"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type AuthContextType = {
  email: string | null;
  token: string | null;
  login: (email: string, token: string) => void;
  logout: () => void;
  isAuth: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  email: null,
  token: null,
  login: () => {},
  logout: () => {},
  isAuth: false,
  loading: true, // 👈 вот так!
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 🟢
  // --- Важно: инициализация из localStorage только при маунте
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedToken = localStorage.getItem("token");

    setEmail(storedEmail);
    setToken(storedToken);
    setIsLoading(false); // ⬅️
  }, []);

  const login = (email: string, token: string) => {
    setEmail(email);
    setToken(token);
    localStorage.setItem("email", email);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setEmail(null);
    setToken(null);
    localStorage.removeItem("email");
    localStorage.removeItem("token");
  };

  // --- ВАЖНО: isAuth вычислять по текущему стейту!
  const isAuth = !!token;

  return (
    <AuthContext.Provider
      value={{
        email,
        token,
        login,
        logout,
        isAuth,
        loading: isLoading, // 👈 добавь!
      }}
    >
      {isLoading ? null : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
