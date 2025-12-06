import styles from "./CourseCard.module.scss";
import { useRouter } from "next/navigation";
type Props = {
  slug: string;
  title: string;
  image: string;
  days: string;
  time: string;
  id: string; // 👈 id курса (Mongo _id)
};

export default function CourseCard({
  slug,
  title,
  image,
  days,
  time,
  id,
}: Props) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/Fitness/courses/${slug}`);
  };

  // ⬇️ ДОБАВЛЕНИЕ КУРСА ПО КНОПКЕ +
  const handleBtnClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // 1. Забираем токен из localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Сначала войдите в аккаунт!");
      router.push("/auth/login");
      return;
    }

    // 2. Делаем POST запрос
    try {
      const response = await fetch(
        "http://localhost:4000/api/fitness/users/me/courses",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ courseId: id }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Курс добавлен!");
        // Можешь тут обновлять стейт/делать красивое уведомление
      } else {
        alert(data.message || "Ошибка добавления курса");
      }
    } catch (err) {
      alert("Ошибка добавления курса");
      console.error(err);
    }
  };

  return (
    <div
      className={styles.coursecard}
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
    >
      <div className={styles.coursecard__imageWrapper}>
        <img className={styles.coursecard__image} src={image} alt={title} />
        <button className={styles.coursecard__addBtn} onClick={handleBtnClick}>
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
