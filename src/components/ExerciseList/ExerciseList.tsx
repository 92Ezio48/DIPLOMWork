import React from "react";
import styles from "./ExerciseList.module.scss";
export type Exercise = {
  _id: string;
  name: string;
  quantity: number;
  // (можешь добавить другие поля, если надо)
};
type ExerciseListProps = {
  dayNumber: number;
  onProgressClick?: () => void;
  progressColumns: number[][]; // массив процентов (0...100) по упражнениям
  exercises: Exercise[]; // ⬅️ Важно! Теперь есть prop exercises
};

export const ExerciseList: React.FC<ExerciseListProps> = ({
  dayNumber,
  onProgressClick,
  progressColumns,
  exercises,
}) => {
  // Например:
  return (
    <div className={styles.root}>
      <h2 className={styles.title}>
        Упражнения <br /> тренировки {dayNumber}
      </h2>
      <div className={styles.columns}>
        {progressColumns.map((col, colIdx) => (
          <div className={styles.col} key={colIdx}>
            {col.map((percent, idx) => {
              // Абсолютный индекс для exercises (по колонкам)
              const absIdx = colIdx * 3 + idx;
              const exercise = exercises[absIdx];
              return exercise ? (
                <div className={styles.exercise} key={`${colIdx}-${idx}`}>
                  <span>
                    {exercise.name} {percent}%
                  </span>
                  <div className={styles.exerciseProgressBar}>
                    <div
                      className={styles.exerciseProgressFill}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              ) : null;
            })}
          </div>
        ))}
      </div>
      <button className={styles.button} onClick={onProgressClick}>
        {/* Можно оставить как есть */}
        {"Заполнить/обновить свой прогресс"}
      </button>
    </div>
  );
};

export default ExerciseList;
