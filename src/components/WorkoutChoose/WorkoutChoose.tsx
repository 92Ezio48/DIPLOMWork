import React from "react";
import styles from "./WorkoutChoose.module.scss";

export type UserWorkout = {
  id: string;
  name: string;
  desc: string;
  done: boolean;
};

type WorkoutChooseProps = {
  workouts: UserWorkout[];
  selectedIdx: number;
  onSelect: (idx: number) => void;
  onStart: (idx: number) => void;
  onClose: () => void;
  isLoading?: boolean;
  courseTitle: string;
};

const WorkoutChoose: React.FC<WorkoutChooseProps> = ({
  workouts,
  selectedIdx,
  onSelect,
  onStart,
  onClose,
  isLoading,
  courseTitle = "Стретчинг", // или "Йога"
}) => (
  <div className={styles.modalBg} onClick={onClose}>
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      <div className={styles.title}>Выберите тренировку</div>
      <div className={styles.workoutList}>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "30px" }}>
            Загрузка...
          </div>
        ) : (
          workouts.map((w, i) => (
            <div
              className={
                styles.workoutItem +
                (selectedIdx === i ? " " + styles.active : "")
              }
              key={w.id}
              onClick={() => onSelect(i)}
            >
              <div
                className={
                  w.done
                    ? styles.circleDone
                    : selectedIdx === i
                    ? styles.circleActive
                    : styles.circle
                }
              >
                {/* SVG-кружки подставишь потом */}
                {w.done ? (
                  <img src="/WorkoutDoneCircle.svg" alt="done" />
                ) : (
                  <img src="/WorkoutCircle.svg" alt="progress" />
                )}
              </div>
              <div>
                <div className={styles.name}>{w.name}</div>

                <div className={styles.desc}>
                  {`${courseTitle} на каждый день / ${i + 1} день`}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <button
        className={styles.startBtn}
        onClick={() => onStart(selectedIdx)}
        disabled={isLoading}
      >
        Начать
      </button>
    </div>
  </div>
);

export default WorkoutChoose;
