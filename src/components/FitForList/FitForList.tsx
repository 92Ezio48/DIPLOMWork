import React from "react";
import styles from "./FitForList.module.scss";

type Props = {
  items: string[];
};

const FitForList: React.FC<Props> = ({ items }) => (
  <div className={styles.list}>
    {items.map((text, i) => (
      <div className={styles.item} key={i}>
        <span className={styles.number}>{i + 1}</span>
        <span className={styles.text}>{text}</span>
      </div>
    ))}
  </div>
);

export default FitForList;
