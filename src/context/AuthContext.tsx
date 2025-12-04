// src/context/AuthContext.tsx
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
};

const AuthContext = createContext<AuthContextType>({
  email: null,
  token: null,
  login: () => {},
  logout: () => {},
  isAuth: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // При маунте подтягиваем из localStorage
    setEmail(localStorage.getItem("email"));
    setToken(localStorage.getItem("token"));
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

  return (
    <AuthContext.Provider
      value={{
        email,
        token,
        login,
        logout,
        isAuth: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
