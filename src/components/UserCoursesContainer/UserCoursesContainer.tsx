import { useEffect, useState } from "react";
import UserCourseCard from "@/components/UserCourseCard/UserCourseCard";
import styles from "./UserCoursesContainer.module.scss";

const coursesLocal = [
  {
    _id: "69335925d2bf502c0e0d131b", // 👈 важно!
    slug: "yoga",
    title: "Йога",
    image: "/YogaCard.svg",
    days: "25 дней",
    time: "20–50 мин/день",
  },
  {
    _id: "6933599fd2bf502c0e0d131f",
    slug: "stretching",
    title: "Стретчинг",
    image: "/Course2.svg",
    days: "25 дней",
    time: "15–35 мин/день",
  },
  {
    _id: "693359c2d2bf502c0e0d1321",
    slug: "fitness",
    title: "Фитнес",
    image: "/Course3.svg",
    days: "25 дней",
    time: "25–40 мин/день",
  },
  {
    _id: "693359e1d2bf502c0e0d1323",
    slug: "step-aerobics",
    title: "Степ-аэробика",
    image: "/Course4.svg",
    days: "25 дней",
    time: "20–30 мин/день",
  },
  {
    _id: "693359f8d2bf502c0e0d1325",
    slug: "bodyflex",
    title: "Бодифлекс",
    image: "/Course5.svg",
    days: "25 дней",
    time: "10–20 мин/день",
  },
];

export default function UserCoursesContainer() {
  const [userCourses, setUserCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch("http://localhost:4000/api/fitness/users/me/courses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUserCourses(data.courses || []))
      .catch(() => setUserCourses([]))
      .finally(() => setLoading(false));
  }, []);

  // 💡 ФУНКЦИЯ ТУТ, а не снаружи!
  const handleDelete = async (courseId) => {
    setUserCourses((prev) => prev.filter((c) => c.courseId !== courseId));
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await fetch(
        `http://localhost:4000/api/fitness/users/me/courses/${courseId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (e) {
      // обработка ошибок при желании
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (userCourses.length === 0)
    return <div>У вас ещё нет добавленных курсов!</div>;

  return (
    <div className={styles.grid}>
      {userCourses.map((uc) => {
        const localCourse = coursesLocal.find((c) => c._id === uc.courseId);
        if (!localCourse) return null;
        return (
          <UserCourseCard
            key={uc.courseId}
            slug={localCourse.slug}
            title={localCourse.title}
            image={localCourse.image}
            days={localCourse.days}
            time={localCourse.time}
            id={localCourse._id}
            progress={uc.progress}
            onDelete={handleDelete}
          />
        );
      })}
    </div>
  );
}
