"use client";
import BubbleMessage from "@/components/BubbleMessage/BubbleMessage";
import CoursesContainer from "@/components/CoursesContainer/CoursesContainer";
import styles from "./MainContainer.module.scss";

export default function MainContainer() {
  return (
    <main className={styles.main}>
      <div className={styles.headerRow}>
        <div className={styles.main__title}>
          <h1 className={styles.h1}>
            Начните заниматься спортом
            <br /> и улучшите качество жизни
          </h1>
        </div>
        <BubbleMessage>
          <span className={styles.Message__text}>
            Измени своё
            <br />
            тело за полгода!
          </span>
        </BubbleMessage>
      </div>
      <CoursesContainer />
      <button
        className={styles.scrollTopButton}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Наверх ↑
      </button>
    </main>
  );
}
