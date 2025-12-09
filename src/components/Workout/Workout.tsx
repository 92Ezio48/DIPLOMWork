"use client";
import React, { useState, useEffect } from "react";
import WorkoutVideo from "../WorkoutVideo/WorkoutVideo";
import ExerciseList from "../ExerciseList/ExerciseList";
import ProgressModal from "../ProgressModal/ProgressModal";
import SuccessToast from "../SuccessToast/SuccessToast";
import styles from "./Workout.module.scss";

export type Exercise = {
  _id: string;
  name: string;
  quantity: number;
  courseName: string;
};

const exerciseNames = [
  "Наклон вперед (подход 1)",
  "Наклон назад (подход 1)",
  "Поднятие ног (подход 1)",
  "Наклон вперед (подход 2)",
  "Наклон назад (подход 2)",
  "Поднятие ног (подход 2)",
  "Наклон вперед (подход 3)",
  "Наклон назад (подход 3)",
  "Поднятие ног (подход 3)",
];
const maxPerExercise = 20;

type WorkoutProps = {
  workoutId: string;
  videoUrl: string;
  courseId: string;
  courseName: string;
  exercises: Exercise[];
  dayNumber: number;
};

export default function Workout({
  workoutId,
  videoUrl,
  courseName,
  courseId,
  exercises,
  dayNumber,
}: WorkoutProps) {
  const [modalOpen, setModalOpen] = useState(false);

  // 🟢 Прогресс точно под exercises.length
  const [progress, setProgress] = useState<number[]>(
    Array(exercises.length).fill(0)
  );
  const [loading, setLoading] = useState(true);
  const [toastOpen, setToastOpen] = useState(false);

  // 🟢 1. Загрузка прогресса при монтировании
  useEffect(() => {
    async function fetchProgress() {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://wedev-api.sky.pro/api/fitness/users/me/progress?courseId=${courseId}&workoutId=${workoutId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.progressData && Array.isArray(data.progressData)) {
          setProgress(data.progressData);
        } else {
          setProgress(Array(exercises.length).fill(0));
        }
      } else {
        setProgress(Array(exercises.length).fill(0));
      }
      setLoading(false);
    }
    fetchProgress();
    // 👇 Автоматически ресетим при изменении кол-ва упражнений
  }, [courseId, workoutId, exercises.length]);

  // 🟢 2. PATCH на сервер
  const handleProgressSave = async (newProgress: number[]) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    await fetch(
      `https://wedev-api.sky.pro/api/fitness/courses/${courseId}/workouts/${workoutId}`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ progressData: newProgress }),
      }
    );
    setProgress(newProgress);
    setModalOpen(false);
    setToastOpen(true);
    setLoading(false);
    setTimeout(() => setToastOpen(false), 2000);
  };

  // ✅ ПРОГРЕСС ПО УПРАЖНЕНИЯМ (только exercises.length)
  const progressPercents = progress.map((count) => {
    const percent = Math.round((count / maxPerExercise) * 100);
    return isNaN(percent) ? 0 : percent;
  });

  // ✅ Если твоему ExerciseList реально нужны "колонки по 3" — формируй вот так:
  const columns = Math.ceil(exercises.length / 3);
  const progressColumns = Array.from({ length: columns }).map((_, colIdx) =>
    [0, 1, 2].map((rowIdx) => {
      const absIdx = colIdx * 3 + rowIdx;
      const value = progress[absIdx] ?? 0;
      const percent = Math.round((value / maxPerExercise) * 100);
      // Если больше упражнений нет — всегда 0%
      return isNaN(percent) || absIdx >= exercises.length ? 0 : percent;
    })
  );

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{courseName}</h2>
      <WorkoutVideo videoUrl={videoUrl} />

      {/* ⛔️ Заглушка или список упражнений */}
      {exercises.length === 0 ? (
        <div className={styles.noExercises}>
          <span
            role="img"
            aria-label="упс"
            style={{ fontSize: 40, display: "inline-block", marginRight: 8 }}
          >
            🤷‍♂️
          </span>
          Нет упражнений в этой тренировке
        </div>
      ) : (
        <>
          <ExerciseList
            dayNumber={dayNumber}
            onProgressClick={() => setModalOpen(true)}
            progressColumns={progressColumns}
          />

          <ProgressModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleProgressSave}
            exerciseNames={exerciseNames.slice(0, exercises.length)}
            maxValues={Array(exercises.length).fill(maxPerExercise)}
            initialProgress={progress}
          />
        </>
      )}

      {toastOpen && <SuccessToast />}
      {loading && <div>Загрузка...</div>}
    </div>
  );
}
