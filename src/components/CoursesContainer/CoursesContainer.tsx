import CourseCard from "@/components/CourseCard/CourseCard";
import styles from "./CoursesContainer.module.scss";
const courses = [
  {
    title: "Йога",
    image: "/YogaCard.svg",
    days: "25 дней",
    time: "20–50 мин/день",
  },
  {
    title: "Стретчинг",
    image: "/Course2.svg",
    days: "18 дней",
    time: "15–35 мин/день",
  },
  {
    title: "Фитнес",
    image: "/Course3.svg",
    days: "20 дней",
    time: "25–40 мин/день",
  },
  {
    title: "Степ-аэробика",
    image: "/Course4.svg",
    days: "16 дней",
    time: "20–30 мин/день",
  },
  {
    title: "Бодифлекс",
    image: "/Course5.svg",
    days: "21 день",
    time: "10–20 мин/день",
  },
];
export default function CoursesContainer() {
  return (
    <div className={styles.grid}>
      {courses.map((course, idx) => (
        <CourseCard
          key={course.title}
          title={course.title}
          image={course.image}
          days={course.days}
          time={course.time}
        />
      ))}
    </div>
  );
}
