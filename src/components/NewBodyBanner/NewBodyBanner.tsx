"use client";
import { useRouter } from "next/navigation";
import styles from "./NewBodyBanner.module.scss";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

type NewBodyBannerProps = {
  courseId: string;
};

export default function NewBodyBanner({ courseId }: NewBodyBannerProps) {
  const router = useRouter();
  const { isAuth, token } = useAuth();
  const [isCourseAdded, setIsCourseAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const formData = new FormData();
  formData.append("courseId", courseId);
  // 🔄 Функция обновления стейта с сервера
  const fetchCourses = () => {
    if (!isAuth || !token) {
      console.log("Нет авторизации:", { isAuth, token });
      return;
    }
    setLoading(true);
    axios
      .get("https://wedev-api.sky.pro/api/fitness/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const allCourses = res.data.user.selectedCourses || [];
        console.log("🏓 fetchCourses:", { courseId, allCourses });
        setIsCourseAdded(allCourses.includes(courseId));
      })
      .catch((e) => console.log("Ошибка /users/me:", e))
      .finally(() => setLoading(false));
  };

  useEffect(fetchCourses, [courseId, isAuth, token]);

  // ⚡ Кнопка добавить/удалить курс
  const handleClick = async () => {
    if (!isAuth) {
      router.push("/auth/login");
      return;
    }
    setLoading(true);
    try {
      if (isCourseAdded) {
        // 🚫 Удаление курса — DELETE
        await axios.delete(
          `https://wedev-api.sky.pro/api/fitness/users/me/courses/${courseId}`,

          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("⚡ Курс удалён:", courseId);
      } else {
        // ➕ Добавление курса — POST
        await axios.post(
          "https://wedev-api.sky.pro/api/fitness/users/me/courses",
          { courseId },

          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "", // ✨ явно указываем, что это JSON!
            },
          }
        );
        console.log("⚡ Курс добавлен:", courseId);
      }
      // Обновить состояние из сервера после действия!
      fetchCourses();
    } catch (err) {
      alert("Ошибка при обновлении курса");
    }
    setLoading(false);
  };

  return (
    <section className={styles.banner}>
      <div className={styles.left}>
        <h2 className={styles.title}>
          Начните путь <br />к новому телу
        </h2>
        <ul className={styles.features}>
          <li>проработка всех групп мышц</li>
          <li>тренировка суставов</li>
          <li>улучшение циркуляции крови</li>
          <li>упражнения заряжают бодростью</li>
          <li>помогают противостоять стрессам</li>
        </ul>
        <div className={styles.ForButton}>
          <button
            className={styles.button}
            onClick={handleClick}
            disabled={loading}
          >
            {isAuth
              ? isCourseAdded
                ? "Удалить курс"
                : "Добавить курс"
              : "Войдите, чтобы добавить курс"}
          </button>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.imageWrapper}>
          <img
            src="/Sportsman.svg"
            alt="Спортсмен"
            className={styles.athleteImage}
            draggable={false}
          />
          <img
            src="/ArtOnBanner.svg"
            alt="Узор"
            className={styles.decorLine}
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
