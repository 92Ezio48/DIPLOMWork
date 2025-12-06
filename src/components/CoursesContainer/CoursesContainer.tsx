import { useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard/CourseCard";
import styles from "./CoursesContainer.module.scss";

const coursesLocal = [
  {
    slug: "yoga",
    title: "Йога",
    image: "/YogaCard.svg",
    days: "25 дней",
    time: "20–50 мин/день",
  },
  {
    slug: "stretching",
    title: "Стретчинг",
    image: "/Course2.svg",
    days: "25 дней",
    time: "15–35 мин/день",
  },
  {
    slug: "fitness",
    title: "Фитнес",
    image: "/Course3.svg",
    days: "25 дней",
    time: "25–40 мин/день",
  },
  {
    slug: "step-aerobics",
    title: "Степ-аэробика",
    image: "/Course4.svg",
    days: "25 дней",
    time: "20–30 мин/день",
  },
  {
    slug: "bodyflex",
    title: "Бодифлекс",
    image: "/Course5.svg",
    days: "25 дней",
    time: "10–20 мин/день",
  },
];

export default function CoursesContainer() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/fitness/courses")
      .then((res) => res.json())
      .then((data) => {
        setIds(data.map((course: any) => course._id));
      });
  }, []);

  // Пока не получили айдишники с сервера — ничего не рендерим или показываем заглушку
  if (ids.length !== coursesLocal.length) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className={styles.grid}>
      {coursesLocal.map((course, idx) => (
        <CourseCard
          key={course.slug}
          title={course.title}
          image={course.image}
          days={course.days}
          time={course.time}
          slug={course.slug}
          id={ids[idx]} // <-- Айди с сервера!
        />
      ))}
    </div>
  );
}
