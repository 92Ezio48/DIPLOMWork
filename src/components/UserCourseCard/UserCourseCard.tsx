import styles from "./UserCourseCard.module.scss";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import WorkoutChoose from "../WorkoutChoose/WorkoutChoose";
import { UserWorkout } from "../WorkoutChoose/WorkoutChoose";
import { useAuth } from "@/context/AuthContext";

type Props = {
  slug: string;
  title: string;
  image: string;
  days: string;
  time: string;
  id: string; // id курса
  onDelete?: (courseId: string) => void;
};

function isWorkoutDoneLocally(id: string) {
  return (
    typeof window !== "undefined" &&
    localStorage.getItem("workout_completed_" + id) === "true"
  );
}

export default function UserCourseCard({
  slug,
  title,
  image,
  days,
  time,
  id,
  onDelete,
}: Props) {
  const router = useRouter();
  const { isAuth, token, loading } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [workouts, setWorkouts] = useState<UserWorkout[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Дождаться инициализации auth-контекста
    if (!modalOpen || loading) return;

    // Не делаем запросы без авторизации
    if (!isAuth || !token) {
      setWorkouts([]);
      setIsLoading(false);
      setProgress(0);
      return;
    }

    setIsLoading(true);

    // Получаем тренировки курса
    fetch(`https://wedev-api.sky.pro/api/fitness/courses/${id}/workouts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) throw new Error("Требуется авторизация");
        return res.json();
      })
      .then((workoutList) => {
        const workoutsArr: UserWorkout[] = (workoutList || []).map(
          (item: any, idx: number) => ({
            id: item._id || String(idx),
            name:
              typeof item.name === "string" && item.name.trim() !== ""
                ? item.name
                : `Тренировка #${idx + 1}`,
            desc: `День ${idx + 1}`,
            done: false,
          })
        );

        // Подгружаем прогресс пользователя с авторизацией
        return fetch(
          `https://wedev-api.sky.pro/api/fitness/users/me/progress?courseId=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then((res) => res.json())
          .then((progressData) => {
            workoutsArr.forEach((w) => {
              // прогресс с сервера
              const apiDone = !!progressData?.workoutsProgress?.find(
                (p: any) => p.workoutId === w.id && p.workoutCompleted
              );
              // локальный прогресс
              const localDone = isWorkoutDoneLocally(w.id);
              w.done = apiDone || localDone;
            });
            setWorkouts(workoutsArr);

            // 👇 Считаем процент завершения!
            const doneCount = workoutsArr.filter((w) => w.done).length;
            const total = workoutsArr.length;
            setProgress(total > 0 ? Math.round((doneCount / total) * 100) : 0);
          })
          .catch(() => {
            // fallback: только localStorage
            workoutsArr.forEach((w) => {
              w.done = isWorkoutDoneLocally(w.id);
            });

            setWorkouts(workoutsArr);

            // 👇 Считаем прогресс по локальному хранилищу
            const doneCount = workoutsArr.filter((w) => w.done).length;
            const total = workoutsArr.length;
            setProgress(total > 0 ? Math.round((doneCount / total) * 100) : 0);
          });
      })
      .catch((err) => {
        alert(err.message);
        setWorkouts([]);
        setProgress(0);
      })
      .finally(() => setIsLoading(false));
  }, [modalOpen, id, isAuth, token, loading]);

  // --- UI кнопки ---
  let buttonText = "Начать тренировки";
  if (progress > 0 && progress < 100) buttonText = "Продолжить";
  else if (progress >= 100) buttonText = "Начать заново";

  // --- Обработчики ---
  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalOpen(true);
  };

  const handleCardClick = () => {
    router.push(`/Fitness/courses/${slug}`);
  };

  // Используем token из useAuth при удалении!
  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!token) {
      alert("Сначала войдите в аккаунт!");
      router.push("/auth/login");
      return;
    }

    if (!confirm("Удалить курс из профиля?")) return;

    try {
      const response = await fetch(
        `https://wedev-api.sky.pro/api/fitness/users/me/courses/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        onDelete?.(id);
        alert("Курс удалён!");
      } else {
        alert(data.message || "Ошибка при удалении курса");
      }
    } catch (err) {
      alert("Ошибка при удалении курса");
      console.error(err);
    }
  };

  const handleStartWorkout = (idx: number) => {
    router.push(`/Fitness/courses/${slug}/workouts/${workouts[idx].id}`);
    setModalOpen(false);
  };

  // --- РЕНДЕР ---

  // Loader auth-контекста
  if (loading) {
    return (
      <div className={styles.coursecard}>
        <div style={{ padding: 30, textAlign: "center" }}>
          Проверка авторизации...
        </div>
      </div>
    );
  }

  // Нет авторизации
  if (!isAuth || !token) {
    return (
      <div className={styles.coursecard}>
        <div style={{ padding: 30, textAlign: "center" }}>
          <b>Войдите в аккаунт, чтобы просматривать свои тренировки!</b>
          <br />
          <button
            className={styles.coursecard__actionBtn}
            onClick={() => router.push("/auth/login")}
          >
            Войти
          </button>
        </div>
      </div>
    );
  }

  // Всё остальное без изменений!
  return (
    <div
      className={styles.coursecard}
      role="button"
      tabIndex={0}
      onClick={modalOpen ? undefined : handleCardClick}
    >
      <div className={styles.coursecard__imageWrapper}>
        <img className={styles.coursecard__image} src={image} alt={title} />
        <button
          className={styles.coursecard__addBtn}
          onClick={handleDeleteClick}
        >
          <img src="/MinusCourseBtn.svg" alt="Удалить курс" />
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
          <p>Сложность</p>
        </div>
        <div className={styles.coursecard__progressBlock}>
          <p className={styles.coursecard__progressTitle}>
            Прогресс {progress}%
          </p>
          <div className={styles.coursecard__progressBar}>
            <div
              className={styles.coursecard__progressFill}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <button
          className={styles.coursecard__actionBtn}
          onClick={handleActionClick}
        >
          {buttonText}
        </button>
        {modalOpen && (
          <WorkoutChoose
            workouts={workouts}
            selectedIdx={selectedIdx}
            onSelect={setSelectedIdx}
            onStart={handleStartWorkout}
            onClose={() => setModalOpen(false)}
            isLoading={isLoading}
            courseTitle={title}
          />
        )}
      </div>
    </div>
  );
}
