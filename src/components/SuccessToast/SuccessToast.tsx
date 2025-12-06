import React from "react";
import styles from "./SuccessToast.module.scss";

export default function SuccessToast() {
  return (
    <div className={styles.toast}>
      <div className={styles.text}>
        Ваш прогресс <br /> засчитан!
      </div>
      <div className={styles.icon}>
        {/* SVG галочка в круге */}
        <img src="/ProgressDone.svg" alt="Профиль" className={styles.avatar} />
      </div>
    </div>
  );
}
