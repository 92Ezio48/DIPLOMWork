"use client";
import ProfileInfo from "../ProfileInfo/ProfileInfo";
import UserCoursesContainer from "@/components/UserCoursesContainer/UserCoursesContainer";
import { useAuth } from "@/context/AuthContext";
import styles from "./Profile.module.scss";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { email, logout, isAuth } = useAuth();
  const router = useRouter();

  const nickname = email?.split("@")[0] || "Гость";
  const login = email || "none";

  return (
    <div className={styles.profilePage}>
      <h1 className={styles.title}>Профиль</h1>
      <ProfileInfo
        nickname={nickname}
        login={login}
        onLogout={() => {
          logout();
          router.push("/auth/login");
        }}
      />

      <h2 className={styles.subtitle}>Мои курсы</h2>
      <div className={styles.coursesSection}>
        <UserCoursesContainer />
      </div>
    </div>
  );
}
