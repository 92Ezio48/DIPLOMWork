import styles from "./CourseCard.module.scss";
import AddCourseBtn from "@/assets/AddCourseBtn.svg";

export default function CourseCard({ title, image, days, time }) {
  return (
    <div className={styles.coursecard}>
      <div className={styles.coursecard__imageWrapper}>
        <img className={styles.coursecard__image} src={image} alt={title} />
        <button className={styles.coursecard__addBtn}>
          <img src="/AddCourseBtn.svg" alt="Добавить курс" />
        </button>
      </div>
      <div className={styles.coursecard__body}>
        <div className={styles.coursecard__title}>{title}</div>
        <div className={styles.coursecard__info}>
          <div className={styles.coursecard__icontext}>
            <span className={styles.coursecard__icon}>
              <img src="/CardDate.svg" alt="Длительность курса" />
            </span>
            {days}
          </div>
          <div className={styles.coursecard__icontext}>
            <span className={styles.coursecard__icon}>
              <img src="/CardTime.svg" alt="Время в день" />
            </span>
            {time}
          </div>
        </div>
        <div className={styles.coursecard__meta}>
          <span className={styles.coursecard__difficultyIcon}>
            <img src="/CardDifficult.svg" alt="Сложность" />
          </span>
          <span>Сложность</span>
        </div>
      </div>
    </div>
  );
}
