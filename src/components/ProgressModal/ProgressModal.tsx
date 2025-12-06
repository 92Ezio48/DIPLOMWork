import React, { useState, useEffect } from "react";
import styles from "./ProgressModal.module.scss";

interface ProgressModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: number[]) => void;
  exerciseNames: string[];
  maxValues?: number[];
  initialProgress?: number[];
}

export default function ProgressModal({
  open,
  onClose,
  onSave,
  exerciseNames,
  maxValues = Array(9).fill(20),
  initialProgress,
}: ProgressModalProps) {
  const [form, setForm] = useState<number[]>(
    initialProgress || Array(9).fill(0)
  );

  useEffect(() => {
    if (open) {
      setForm(initialProgress || Array(9).fill(0));
    }
  }, [open, initialProgress]);

  function handleChange(idx: number, value: string) {
    const newForm = [...form];
    newForm[idx] = Math.max(0, Number(value) || 0);
    setForm(newForm);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form); // onSave теперь всё решает!
  }

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Мой прогресс</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputsScroll}>
            {exerciseNames.map((exName, idx) => (
              <label className={styles.label} key={idx}>
                {exName}
                <input
                  className={styles.input}
                  type="number"
                  min="0"
                  step="1"
                  value={form[idx]}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onWheel={(e) => e.currentTarget.blur()}
                  max={maxValues[idx]}
                  placeholder="0"
                />
              </label>
            ))}
          </div>
          <button type="submit" className={styles.saveBtn}>
            Сохранить
          </button>
        </form>
      </div>
    </div>
  );
}
