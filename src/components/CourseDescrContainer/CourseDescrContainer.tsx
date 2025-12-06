"use client";
import FitForList from "../FitForList/FitForList";
import DirectionsList from "../DirectionsList/DirectionsList";
import styles from "./CourseDescrContainer.module.scss";
import NewBodyBanner from "../NewBodyBanner/NewBodyBanner";

export default function CourseDescrContainer({
  desktopImage,
  mobileImage,
  fitForItems,
  directions,
  isAuth,
}) {
  return (
    <main className={styles.main}>
      <section className={styles.courseImageSec}>
        <picture>
          <source srcSet={mobileImage} media="(max-width: 600px)" />
          <img
            src={desktopImage}
            alt="Курс"
            className={styles.courseCardImage}
          />
        </picture>
      </section>
      <section className={styles.fitForSection}>
        <h2 className={styles.fitForTitle}>Подойдёт для вас, если:</h2>
        <FitForList items={fitForItems} />
      </section>
      <h2 className={styles.directions}>Направления</h2>
      <DirectionsList directions={directions} />
      <NewBodyBanner />
    </main>
  );
}
