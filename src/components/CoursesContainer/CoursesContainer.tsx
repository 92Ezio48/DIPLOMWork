import { useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard/CourseCard";
import styles from "./CoursesContainer.module.scss";

// Локальные данные для slug и картинок
const coursesLocal = [
  { slug: "yoga", title: "Йога", image: "/YogaCard.svg" },
  { slug: "stretching", title: "Стретчинг", image: "/Course2.svg" },
  { slug: "fitness", title: "Фитнес", image: "/Course3.svg" },
  { slug: "step-aerobics", title: "Степ-аэробика", image: "/Course4.svg" },
  { slug: "bodyflex", title: "Бодифлекс", image: "/Course5.svg" },
];

export default function CoursesContainer() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    fetch("https://wedev-api.sky.pro/api/fitness/courses")
      .then((res) => {
        if (!res.ok) throw new Error("Сервер вернул ошибку");
        return res.json();
      })
      .then((data) => {
        setCourses(data);
        setError(null);
      })
      .catch(() => {
        setError("Ошибка загрузки курсов. Попробуйте позже.");
        setCourses([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }
  if (error) {
    return (
      <div style={{ color: "red", padding: "24px", textAlign: "center" }}>
        {error}
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {courses.map((course) => {
        // 🔎 Связываем курс с локальным по русскому названию
        const local = coursesLocal.find(
          (c) => c.title.toLowerCase() === course.nameRU.toLowerCase()
        );
        // Для перехода и роута нужен slug
        const slug = local
          ? local.slug
          : course.nameEN?.toLowerCase() || course._id;

        if (!local) {
          console.warn(
            "❌ Нет локального курса для:",
            course.nameRU,
            "Ждали один из →",
            coursesLocal.map((c) => c.title)
          );
          // Можно добавить обработку, чтобы не было пустых заглушек
        }

        return (
          <CourseCard
            key={course._id}
            id={course._id}
            slug={slug}
            title={course.nameRU}
            image={local ? local.image : "/default.svg"}
            days={course.durationInDays ? `${course.durationInDays} дней` : "—"}
            time={
              course.dailyDurationInMinutes
                ? `${course.dailyDurationInMinutes.from}–${course.dailyDurationInMinutes.to} мин/день`
                : "—"
            }
          />
        );
      })}
    </div>
  );
}
