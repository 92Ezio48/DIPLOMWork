"use client";
import styles from "./ProfileInfo.module.scss";

interface ProfileInfoProps {
  nickname: string;
  login: string;
  avatarSrc?: string;
  onLogout?: () => void;
}

export default function ProfileInfo({
  nickname,
  login,
  avatarSrc = "/DefAvatar.svg",
  onLogout,
}: ProfileInfoProps) {
  return (
    <div className={styles.card}>
      <div className={styles.avatarWrap}>
        <img src={avatarSrc} alt="Аватар" className={styles.avatar} />
      </div>
      <div className={styles.info}>
        <div className={styles.nickname}>{nickname}</div>
        <div className={styles.login}>Логин: {login}</div>
        {onLogout && (
          <button className={styles.logoutBtn} onClick={onLogout}>
            Выйти
          </button>
        )}
      </div>
    </div>
  );
}
