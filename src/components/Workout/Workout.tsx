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

  // Загрузка прогресса при монтировании
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
  }, [courseId, workoutId, exercises.length]);

  // PATCH на сервер
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

  // Проценты в каждой клетке
  const progressPercents = progress.map((cnt, idx) => {
    const quantity = exercises[idx]?.quantity || 1;
    const percent = Math.round((cnt / quantity) * 100);
    return Math.min(percent, 100); // Не больше 100%
  });
  // Для ExerciseList, если нужно колонками по 3
  const columns = Math.ceil(exercises.length / 3);
  const progressColumns = Array.from({ length: columns }).map((_, colIdx) =>
    [0, 1, 2].map((rowIdx) => {
      const absIdx = colIdx * 3 + rowIdx;
      const percent = progressPercents[absIdx] || 0;
      return absIdx < exercises.length ? percent : 0;
    })
  );

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{courseName}</h2>
      <WorkoutVideo videoUrl={videoUrl} />

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
            exercises={exercises}
          />
          <ProgressModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleProgressSave}
            exerciseNames={exercises.map((ex) => ex.name)}
            maxValues={exercises.map((ex) => ex.quantity)}
            initialProgress={progress}
          />
        </>
      )}

      {toastOpen && <SuccessToast />}
      {loading && <div>Загрузка...</div>}
    </div>
  );
}
