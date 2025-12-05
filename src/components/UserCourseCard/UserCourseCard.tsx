import styles from "./UserCourseCard.module.scss";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import WorkoutChoose from "../WorkoutChoose/WorkoutChoose";
import { UserWorkout } from "../WorkoutChoose/WorkoutChoose";

type Props = {
  slug: string;
  title: string;
  image: string;
  days: string;
  time: string;
  id: string; // id курса
  progress: number;
  onDelete?: (courseId: string) => void;
};

export default function UserCourseCard({
  slug,
  title,
  image,
  days,
  time,
  id,
  progress,
  onDelete,
}: Props) {
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [workouts, setWorkouts] = useState<UserWorkout[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!modalOpen) return;
    setIsLoading(true);

    fetch(`http://localhost:4000/api/fitness/courses/${id}`)
      .then((res) => res.json())
      .then((course) => {
        const workoutsArr: UserWorkout[] = (course.workouts || []).map(
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

        return fetch(
          `http://localhost:4000/api/fitness/users/me/progress?courseId=${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        )
          .then((res) => res.json())
          .then((progressData) => {
            if (progressData?.workoutsProgress) {
              workoutsArr.forEach((w) => {
                const match = progressData.workoutsProgress.find(
                  (p: any) => p.workoutId === w.id
                );
                w.done = !!match?.workoutCompleted;
              });
            }
            setWorkouts(workoutsArr);
          })
          .catch(() => setWorkouts(workoutsArr));
      })
      .finally(() => setIsLoading(false));
  }, [modalOpen, id]);

  let buttonText = "Начать тренировки";
  if (progress > 0 && progress < 100) buttonText = "Продолжить";
  else if (progress >= 100) buttonText = "Начать заново";

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalOpen(true);
  };

  const handleCardClick = () => {
    router.push(`/Fitness/courses/${slug}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(id);
  };

  const handleStartWorkout = (idx: number) => {
    router.push(`/Fitness/courses/${slug}/workouts/${workouts[idx].id}`);
    setModalOpen(false);
  };

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
          <span>Сложность</span>
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
