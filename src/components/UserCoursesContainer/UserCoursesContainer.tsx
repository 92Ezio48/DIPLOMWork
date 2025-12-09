import { useEffect, useState } from "react";
import UserCourseCard from "@/components/UserCourseCard/UserCourseCard";
import styles from "./UserCoursesContainer.module.scss";

// Локальные картинки и слаги для курсов — только для image и slug
const coursesLocal = [
  { slug: "yoga", title: "Йога", image: "/YogaCard.svg" },
  { slug: "stretching", title: "Стретчинг", image: "/Course2.svg" },
  { slug: "fitness", title: "Фитнес", image: "/Course3.svg" },
  { slug: "step-aerobics", title: "Степ-аэробика", image: "/Course4.svg" },
  { slug: "bodyflex", title: "Бодифлекс", image: "/Course5.svg" },
];

const MY_COURSES_KEY = "myCourses";

// --- Функции для localStorage выбранных курсов
function getMyCourses() {
  try {
    return JSON.parse(localStorage.getItem(MY_COURSES_KEY)) || [];
  } catch {
    return [];
  }
}
function removeMyCourse(courseId) {
  const arr = getMyCourses().filter((id) => id !== courseId);
  localStorage.setItem(MY_COURSES_KEY, JSON.stringify(arr));
}

// --- Основной компонент
export default function UserCoursesContainer() {
  const [userCourses, setUserCourses] = useState<any[]>([]);
  const [progressMap, setProgressMap] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Загружаем свои курсы из API
  useEffect(() => {
    async function fetchAndSyncUserCourses() {
      const token = localStorage.getItem("token");
      if (!token) return setLoading(false);

      try {
        // Получаем список выбранных курсов пользователя (по id)
        const res = await fetch(
          "https://wedev-api.sky.pro/api/fitness/users/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        const selectedCourses = data.user?.selectedCourses || [];
        localStorage.setItem(MY_COURSES_KEY, JSON.stringify(selectedCourses));

        // Скачиваем весь список курсов, чтобы получить свежие name, дни, минуты
        const coursesRes = await fetch(
          "https://wedev-api.sky.pro/api/fitness/courses"
        );
        const coursesList = await coursesRes.json();

        // Оставляем только те, что в профиле пользователя
        const filtered = coursesList.filter((course: any) =>
          selectedCourses.includes(course._id)
        );
        setUserCourses(filtered);
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    }
    fetchAndSyncUserCourses();
  }, []);

  // Прогресс тренировки (пока не используем реальное API)
  useEffect(() => {
    if (userCourses.length === 0) return;
    async function loadProgress() {
      const arr = userCourses.map((course) => [
        course._id,
        { workoutsProgress: [] },
      ]);
      setProgressMap(Object.fromEntries(arr));
    }
    loadProgress();
  }, [userCourses]);

  // --- Удаление курса ---
  const handleDelete = (courseId: string) => {
    removeMyCourse(courseId);
    setUserCourses((prev) => prev.filter((c) => c._id !== courseId));
  };

  // --- Рендер ---
  if (loading) return <div>Загрузка...</div>;
  if (userCourses.length === 0)
    return <div>У вас ещё нет добавленных курсов!</div>;

  return (
    <div className={styles.grid}>
      {userCourses.map((course: any) => {
        // Подбираем картинку и slug из локального справочника по русскому названию
        const local = coursesLocal.find(
          (c) => c.title.toLowerCase() === course.nameRU?.toLowerCase()
        );
        // Длительность курса (только из API)
        const days = course.durationInDays
          ? `${course.durationInDays} дней`
          : "—";
        // Время курса (только из API)
        const time = course.dailyDurationInMinutes
          ? `${course.dailyDurationInMinutes.from}–${course.dailyDurationInMinutes.to} мин/день`
          : "—";
        // Прогресс (пример: всегда 0%)
        const progressData = progressMap[course._id];
        let percent = 0;
        if (progressData && course.durationInDays) {
          const total = Number(course.durationInDays);
          const completed = Array.isArray(progressData.workoutsProgress)
            ? progressData.workoutsProgress.filter(
                (w: any) => w.workoutCompleted
              ).length
            : 0;
          percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        }

        return (
          <UserCourseCard
            key={course._id}
            slug={
              local ? local.slug : course.nameEN?.toLowerCase() || course._id
            }
            title={course.nameRU}
            image={local ? local.image : "/default.svg"}
            days={days}
            time={time}
            id={course._id}
            onDelete={() => handleDelete(course._id)}
          />
        );
      })}
    </div>
  );
}
