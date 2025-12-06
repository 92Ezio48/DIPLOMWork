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
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    // Загружаем курсы пользователя
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

  // Загружаем прогресс по всем курсам пользователя
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || userCourses.length === 0) return;
    async function loadProgress() {
      // Promise.all запускаем для ВСЕХ id
      const arr = await Promise.all(
        userCourses.map(async (uc) => {
          const res = await fetch(
            `http://localhost:4000/api/fitness/users/me/progress?courseId=${uc.courseId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (!res.ok) return [uc.courseId, null];
          const data = await res.json();
          return [uc.courseId, data];
        })
      );
      setProgressMap(Object.fromEntries(arr));
    }
    loadProgress();
  }, [userCourses]);

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
    } catch (e) {}
  };

  if (loading) return <div>Загрузка...</div>;
  if (userCourses.length === 0)
    return <div>У вас ещё нет добавленных курсов!</div>;

  return (
    <div className={styles.grid}>
      {userCourses.map((uc) => {
        const localCourse = coursesLocal.find((c) => c._id === uc.courseId);
        if (!localCourse) return null;

        // Получаем прогресс из Map
        const progressData = progressMap[uc.courseId];
        let percent = 0;
        if (progressData && localCourse.days) {
          // Дни: "25 дней" => 25, можно иначе хранить число
          const total = Number(localCourse.days.split(" ")[0]);
          const completed = Array.isArray(progressData.workoutsProgress)
            ? progressData.workoutsProgress.filter((w) => w.workoutCompleted)
                .length
            : 0;
          percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        }

        return (
          <UserCourseCard
            key={uc.courseId}
            slug={localCourse.slug}
            title={localCourse.title}
            image={localCourse.image}
            days={localCourse.days}
            time={localCourse.time}
            id={localCourse._id}
            progress={percent}
            onDelete={handleDelete}
          />
        );
      })}
    </div>
  );
}
