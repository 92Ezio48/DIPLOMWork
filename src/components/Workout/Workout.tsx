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
  const [progress, setProgress] = useState<number[]>(Array(9).fill(0));
  const [loading, setLoading] = useState(true);
  const [toastOpen, setToastOpen] = useState(false);

  // 🟢 1. Загрузка прогресса при монтировании
  useEffect(() => {
    async function fetchProgress() {
      setLoading(true);
      const token = localStorage.getItem("token"); // Если ты используешь JWT
      const res = await fetch(
        `http://localhost:4000/api/fitness/users/me/progress?courseId=${courseId}&workoutId=${workoutId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.progressData && data.progressData.length > 0) {
          setProgress(data.progressData);
        }
      }
      setLoading(false);
    }
    fetchProgress();
  }, [courseId, workoutId]);

  // 🟢 2. Сохранение прогресса на сервере
  const handleProgressSave = async (newProgress: number[]) => {
    setLoading(true);
    const token = localStorage.getItem("token"); // Если используешь токены
    // PATCH прогресса
    await fetch(
      `http://localhost:4000/api/fitness/courses/${courseId}/workouts/${workoutId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ progressData: newProgress }),
      }
    );
    setProgress(newProgress);
    setModalOpen(false);
    setToastOpen(true);
    setLoading(false);
    setTimeout(() => setToastOpen(false), 2000);
  };

  // Прогресс в процентах для отображения
  const progressColumns = Array.from({ length: 3 }).map((_, colIdx) =>
    [0, 1, 2].map((rowIdx) => {
      const absIdx = colIdx * 3 + rowIdx;
      return Math.round((progress[absIdx] / maxPerExercise) * 100);
    })
  );

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{courseName}</h2>
      <WorkoutVideo videoUrl={videoUrl} />

      <ExerciseList
        dayNumber={dayNumber}
        onProgressClick={() => setModalOpen(true)}
        progressColumns={progressColumns}
      />

      <ProgressModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleProgressSave}
        exerciseNames={exerciseNames}
        maxValues={Array(9).fill(maxPerExercise)}
        initialProgress={progress}
      />

      {toastOpen && <SuccessToast />}
      {loading && <div>Загрузка...</div>}
    </div>
  );
}
