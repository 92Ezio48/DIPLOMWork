import React from "react";
import styles from "./ExerciseList.module.scss";

// Всегда фиксированный список названий!
const defaultExerciseNames = [
  "Наклоны вперед",
  "Наклоны назад",
  "Поднятие ног, согнутых в коленях",
];

type ExerciseListProps = {
  dayNumber: number;
  onProgressClick?: () => void;
  progressColumns: number[][]; // массив 3x3 процентов (0...100)
};

export const ExerciseList: React.FC<ExerciseListProps> = ({
  dayNumber,
  onProgressClick,
  progressColumns,
}) => {
  // Собираем в один массив все проценты
  const allPercents = progressColumns.flat();
  // Проверяем, есть ли хоть один выполняемый прогресс (> 0)
  const hasProgress = allPercents.some((percent) => percent > 0);

  return (
    <div className={styles.root}>
      <h2 className={styles.title}>
        Упражнения <br /> тренировки {dayNumber}
      </h2>
      <div className={styles.columns}>
        {progressColumns.map((col, colIdx) => (
          <div className={styles.col} key={colIdx}>
            {col.map((percent, idx) => (
              <div className={styles.exercise} key={`${colIdx}-${idx}`}>
                <span>
                  {defaultExerciseNames[idx]} {percent}%
                </span>
                <div className={styles.exerciseProgressBar}>
                  <div
                    className={styles.exerciseProgressFill}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <button className={styles.button} onClick={onProgressClick}>
        {hasProgress ? "Обновить свой прогресс" : "Заполнить свой прогресс"}
      </button>
    </div>
  );
};

export default ExerciseList;
