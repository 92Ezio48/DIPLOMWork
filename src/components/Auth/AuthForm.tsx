"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "./AuthForm.module.scss";
import axios from "axios";

type AuthFormProps = {
  onClose: () => void;
  mode?: "login" | "register";
};

export default function AuthForm({
  onClose,
  mode: initialMode = "login",
}: AuthFormProps) {
  const { login } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔎 Валидация пароля (регистрация)
  function validatePassword(pw: string) {
    if (pw.length < 6) return "Пароль должен содержать не менее 6 символов";
    if ((pw.match(/[^a-zA-Z0-9]/g) ?? []).length < 2)
      return "Пароль должен содержать не менее 2 спецсимволов";
    if (!/[A-Z]/.test(pw))
      return "Пароль должен содержать как минимум одну заглавную букву";
    return null;
  }

  // 🟦 Основная функция отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Валидация email
    if (!/^\S+@\S+\.\S+$/.test(email))
      return setError("Введите корректный Email");

    // Дополнительная валидация для регистрации
    if (mode === "register") {
      if (password !== repeat) return setError("Пароли не совпадают");
      const pwError = validatePassword(password);
      if (pwError) return setError(pwError);
    }

    setLoading(true);

    try {
      if (mode === "register") {
        // регистрация
        const res = await axios.post(
          "http://localhost:4000/api/fitness/auth/register",
          { email, password }
        );
        onClose();
        router.push("/login");
      } else {
        // авторизация
        const res = await axios.post(
          "http://localhost:4000/api/fitness/auth/login",
          { email, password }
        );
        login(email, res.data.token); // <<<<< ВОТ ТУТ!
        onClose();
        router.push("/Fitness/Main");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Ошибка запроса");
    }
    setLoading(false);
  };

  // Навигация при клике вне модального окна
  function handleOverlayClick() {
    router.push("/Fitness/Main");
  }

  function handleModalClick(e: React.MouseEvent) {
    e.stopPropagation();
  }
  
  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={handleModalClick}>
        <img src="/MainLogo.svg" alt="SkyFitnessPro" className={styles.logo} />
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.input__fields}>
            <input
              className={styles.input}
              type="email"
              placeholder="Логин"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              disabled={loading}
            />
            <input
              className={styles.input}
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            {mode === "register" && (
              <input
                className={styles.input}
                type="password"
                placeholder="Повторите пароль"
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
                disabled={loading}
              />
            )}
          </div>
          {error && <div className={styles.errorText}>{error}</div>}
          <div className={styles.nav}>
            <button className={styles.btn} type="submit" disabled={loading}>
              {mode === "login" ? "Войти" : "Зарегистрироваться"}
            </button>
            <button
              className={styles.btnSec}
              type="button"
              onClick={() => {
                setError(null);
                if (mode === "login") {
                  setMode("register");
                  router.push("/auth/register");
                } else {
                  setMode("login");
                  router.push("/auth/login");
                }
              }}
              disabled={loading}
            >
              {mode === "login" ? "Зарегистрироваться" : "Войти"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
