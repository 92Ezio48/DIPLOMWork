import styles from "./WorkoutVideo.module.scss";

interface WorkoutVideoProps {
  title?: string;
  videoUrl: string;
}

export default function WorkoutVideo({
  title = "Тренировка",
  videoUrl,
}: WorkoutVideoProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.videoContainer}>
        <iframe
          className={styles.video}
          src="https://www.youtube.com/embed/gJPs7b8SpVw?start=1678"
          title="Тренировочное видео"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
