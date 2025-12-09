"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Workout from "@/components/Workout/Workout";
const courses = [
  {
    slug: "yoga",
    _id: "ab1c3f",
    cardSrc: "/skillcard1.svg",
    cardSrcMobile: "/YogaCard.svg",
  },
  {
    slug: "stretching",
    _id: "kfpq8e",
    cardSrc: "/skillcard2.svg",
    cardSrcMobile: "/Course2.svg",
  },
  {
    slug: "fitness",
    _id: "ypox9r",
    cardSrc: "/skillcard3.svg",
    cardSrcMobile: "/Course3.svg",
  },
  {
    slug: "step-aerobics",
    _id: "6i67sm",
    cardSrc: "/skillcard4.svg",
    cardSrcMobile: "/Course4.svg",
  },
  {
    slug: "bodyflex",
    _id: "q02a6i",
    cardSrc: "/skillcard5.svg",
    cardSrcMobile: "/Course5.svg",
  },
];
export default function WorkoutPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const workoutId = params.workoutId;
  const slug = params.slug;

  // 📅 (если нужен day)
  const dayNumber = Number(searchParams.get("day")) || 1;

  const [dataWorkout, setDataWorkout] = useState(null);
  const [dataCourse, setDataCourse] = useState(null);
  const course = courses.find((c) => c.slug === slug);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !workoutId || !slug) return;

    // загружаем workout
    fetch(`https://wedev-api.sky.pro/api/fitness/workouts/${workoutId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setDataWorkout);

    // загружаем курс
    fetch(`https://wedev-api.sky.pro/api/fitness/courses/${course._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setDataCourse);
  }, [workoutId, slug]);

  if (!dataWorkout || !dataCourse) return <div>Loading...</div>;
  return (
    <Workout
      workoutId={dataWorkout._id}
      courseId={dataCourse._id}
      videoUrl={dataWorkout.video}
      courseName={dataCourse.nameRU}
      exercises={dataWorkout.exercises}
      dayNumber={dayNumber}
    />
  );
}
