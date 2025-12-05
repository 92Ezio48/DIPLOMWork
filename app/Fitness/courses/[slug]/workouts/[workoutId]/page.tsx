import Workout from "@/components/Workout/Workout";
import { notFound } from "next/navigation";

// Если params — Promise, используем await!
export default async function WorkoutPage({ params }: any) {
  const realParams = await params; // ⬅️ ждём params!

  // Подставляем значения из реальных params
  const resWorkout = await fetch(
    `http://localhost:4000/api/fitness/workouts/${realParams.workoutId}`,
    { cache: "no-store" }
  );
  if (!resWorkout.ok) return notFound();
  const dataWorkout = await resWorkout.json();

  // Запрашиваем курс для получения названия
  const resCourse = await fetch(
    `http://localhost:4000/api/courses/${realParams.slug}`,
    { cache: "no-store" }
  );
  if (!resCourse.ok) return notFound();
  const dataCourse = await resCourse.json();

  return (
    <>
      <Workout
        videoUrl={dataWorkout.video}
        courseName={dataCourse.nameRU} // УКАЗЫВАЕШЬ ТУТ название курса!
        exercises={dataWorkout.exercises}
      />
    </>
  );
}
