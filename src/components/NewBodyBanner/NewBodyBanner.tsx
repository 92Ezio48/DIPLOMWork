"use client";
import { useRouter } from "next/navigation"; // Next.js 13/14 навигация
import styles from "./NewBodyBanner.module.scss";
import { useAuth } from "@/context/AuthContext";

export default function NewBodyBanner() {
  const router = useRouter();
  const { isAuth } = useAuth();

  // Обработка кнопки
  const handleClick = () => {
    if (isAuth) {
      // Здесь твоя логика добавления курса
      alert("Открыть добавление курса!"); // Заменишь на своё
    } else {
      router.push("/auth/login");
    }
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
        <button className={styles.button} onClick={handleClick}>
          {isAuth ? "Добавить курс" : "Войдите, чтобы добавить курс"}
        </button>
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
