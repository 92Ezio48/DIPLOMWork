import styles from "./Header.module.scss"; // создай этот css рядом

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.logoWrap}>
          <img
            src="/MainLogo.svg"
            alt="SkyFitnessPro Logo"
            className={styles.logo}
          />
        </div>
        <div className={styles.subtitle}>
          Онлайн‑тренировки для занятий дома
        </div>
      </div>
      <button className={styles.user}>Войти</button>
    </header>
  );
}
