"use client";
import styles from "./Header.module.scss";
import { useRouter, usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { email, isAuth, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // 👈 Новый хук!
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Закрытие меню при клике вне
  // ...

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.logoWrap} onClick={() => router.push("/")}>
          <img
            src="/MainLogo.svg"
            alt="SkyFitnessPro Logo"
            className={styles.logo}
            style={{ cursor: "pointer" }}
          />
        </div>
        {pathname !== "/profile" &&
          !/^\/Fitness\/courses\/[^/]+\/workouts\/[^/]+/.test(pathname) && (
            <div className={styles.subtitle}>
              Онлайн‑тренировки для занятий дома
            </div>
          )}
      </div>

      {!isAuth ? (
        <button
          className={styles.user}
          onClick={() => router.push("/auth/login")}
        >
          Войти
        </button>
      ) : (
        <div className={styles.userInfo} ref={menuRef}>
          <button
            className={styles.profileBtn}
            onClick={() => setShowMenu((v) => !v)}
          >
            <span>
              <img src="/Profile.svg" alt="Профиль" className={styles.avatar} />
            </span>
            <span className={styles.username}>{email!.split("@")[0]}</span>
            <span>
              <img
                src="/ProfileFunctions.svg"
                alt="Стрелочка"
                className={styles.ProfileFunctions}
              />
            </span>
          </button>
          {showMenu && (
            <div className={styles.menu}>
              <div className={styles.menuContent}>
                <div className={styles.menuTop}>
                  <div className={styles.menuName}>{email!.split("@")[0]}</div>
                  <div className={styles.menuEmail}>{email}</div>
                </div>
                <button
                  className={styles.menuProfile}
                  onClick={() => {
                    router.push("/profile");
                    setShowMenu(false);
                  }}
                >
                  Мой профиль
                </button>
                <button className={styles.menuLogout} onClick={logout}>
                  Выйти
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
