"use client";
import WorkoutVideo from "../WorkoutVideo/WorkoutVideo";
import styles from "./Workout.module.scss";

export type Exercise = {
  _id: string;
  name: string;
  quantity: number;
  courseName: string;
};

type WorkoutProps = {
  videoUrl: string;

  courseName: string; // 👈 название курса
  exercises: Exercise[];
};

export default function Workout({
  videoUrl,

  courseName,
  exercises,
}: WorkoutProps) {
  return (
    <div className={styles.wrapper}>
      {/* Курс */}
      <h2>{courseName}</h2>
      {/* Тренировка */}

      <WorkoutVideo videoUrl={videoUrl} />
      <ul>
        {exercises.map((ex) => (
          <li key={ex._id}>
            {ex.name} — {ex.quantity} раз
          </li>
        ))}
      </ul>
    </div>
  );
}
