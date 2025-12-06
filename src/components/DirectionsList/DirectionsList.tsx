import styles from "./DirectionsList.module.scss";

export default function DirectionsList({ directions }) {
  if (!directions || !directions.length) return null;

  return (
    <section className={styles.directionsSection}>
      <ul className={styles.directionsList}>
        {directions.map((dir, idx) => (
          <li key={idx} className={styles.directionsItem}>
            <img
              src="/Sparcle.svg"
              alt="Сложность"
              className={styles.sparcle}
            />{" "}
            {dir}
          </li>
        ))}
      </ul>
    </section>
  );
}
