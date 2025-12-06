import Workout from "@/components/Workout/Workout";
import { notFound } from "next/navigation";

export default async function WorkoutPage({ params, searchParams }: any) {
  // Если params Promise, дожидаемся его
  const realParams = await params;
  const realSearchParams = await searchParams;

  const dayNumber = Number(realSearchParams?.day) || 1;
  const workoutId = realParams.workoutId;

  // Получение данных тренировки
  const resWorkout = await fetch(
    `http://localhost:4000/api/fitness/workouts/${workoutId}`,
    { cache: "no-store" }
  );
  if (!resWorkout.ok) return notFound();
  const dataWorkout = await resWorkout.json();

  // Получение данных курса
  const resCourse = await fetch(
    `http://localhost:4000/api/courses/${realParams.slug}`,
    { cache: "no-store" }
  );
  if (!resCourse.ok) return notFound();
  const dataCourse = await resCourse.json();

  return (
    <Workout
      workoutId={dataWorkout._id} // ✅ Передаём workoutId
      courseId={dataCourse._id}
      videoUrl={dataWorkout.video}
      courseName={dataCourse.nameRU}
      exercises={dataWorkout.exercises}
      dayNumber={dayNumber}
    />
  );
}
