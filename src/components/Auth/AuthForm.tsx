"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "./AuthForm.module.scss";
import axios from "axios";
import React from "react";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [repeatError, setRepeatError] = useState<string | null>(null);

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

    let errorFound = false;
    setEmailError(null);
    setPasswordError(null);
    setRepeatError(null);

    // EMAIL
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Введите корректный Email");
      errorFound = true;
    }

    if (mode === "register") {
      // REPEAT PASSWORD
      if (password !== repeat) {
        setRepeatError("Пароли не совпадают");
        errorFound = true;
      }
      // PASSWORD VALIDATION
      const pwError = validatePassword(password);
      if (pwError) {
        setPasswordError(pwError);
        errorFound = true;
      }
    }

    if (errorFound) return;

    setLoading(true);
    const loginValue = email; // если ты хранишь "логин" в этом поле
    const nameValue = "Имя пользователя"; // Получай имя отдельно!

    try {
      if (mode === "register") {
        await axios.post(
          "https://wedev-api.sky.pro/api/fitness/auth/register",
          {
            email: loginValue,
            password: password,
          },
          {
            headers: { "Content-Type": "" },
          }
        );
        onClose();
      } else {
        const res = await axios.post(
          "https://wedev-api.sky.pro/api/fitness/auth/login",
          {
            email: loginValue,
            password: password,
          },
          {
            headers: { "Content-Type": "" },
          }
        );
        login(loginValue, res.data.token);
        onClose();
        router.push("/Fitness/Main");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Ошибка запроса"
      );
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
        <form
          data-testid="form-test"
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <div className={styles.input__fields}>
            <input
              className={`${styles.input} ${
                emailError ? styles.inputError : ""
              }`}
              type="email"
              placeholder="Логин"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              disabled={loading}
            />
            {emailError && (
              <div data-testid="email-error" className={styles.errorTextField}>
                {emailError}
              </div>
            )}

            <input
              className={`${styles.input} ${
                passwordError ? styles.inputError : ""
              }`}
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            {passwordError && (
              <div className={styles.errorTextField}>{passwordError}</div>
            )}

            {mode === "register" && (
              <>
                <input
                  className={`${styles.input} ${
                    repeatError ? styles.inputError : ""
                  }`}
                  type="password"
                  placeholder="Повторите пароль"
                  value={repeat}
                  onChange={(e) => setRepeat(e.target.value)}
                  disabled={loading}
                />
                {repeatError && (
                  <div className={styles.errorTextField}>{repeatError}</div>
                )}
              </>
            )}
          </div>
          {error && (
            <div className={styles.errorText}>
              {error.split("\n").map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < error.split("\n").length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          )}
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
                } else {
                  setMode("login");
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
