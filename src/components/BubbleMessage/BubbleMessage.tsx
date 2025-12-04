import styles from "./BubbleMessage.module.scss";

export default function BubbleMessage({ children }) {
  return (
    <div className={styles.bubble}>
      {children}
      <img
        src="/BubbleTail.svg"
        alt=""
        className={styles.bubbleTail}
        draggable={false}
      />
    </div>
  );
}
