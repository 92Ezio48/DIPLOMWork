const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// --- Мидлварка для аутентификации ---
// Предполагаем, что req.user уже проставлен (JWT-мидлварь).
// Если нет, замени на свою версию поиска пользователя по токену!

// --- Получить прогресс по всему курсу ---
router.get("/", auth, async (req, res) => {
  const { courseId, workoutId } = req.query;

  try {
    const user = req.user;
    const course = user.courses.find(
      (c) => String(c.courseId) === String(courseId)
    );
    if (!course) {
      return res.status(404).json({ message: "Курс не найден" });
    }

    // 1: Прогресс по всей тренировке
    if (!workoutId) {
      return res.json({
        courseId: String(course.courseId),
        courseCompleted: course.progress >= 100,
        workoutsProgress: course.workoutsProgress || [],
      });
    }

    // 2: Прогресс по отдельной тренировке
    const workout = (course.workoutsProgress || []).find(
      (w) => String(w.workoutId) === String(workoutId)
    );
    if (!workout) {
      // Пока прогресса нет — возвратим 0
      return res.json({
        workoutId: String(workoutId),
        workoutCompleted: false,
        progressData: [],
      });
    }
    return res.json(workout);
  } catch (e) {
    res.status(500).json({ message: "Ошибка получения прогресса" });
  }
});

// --- Сохранить прогресс тренировки ---
router.patch(
  "/courses/:courseId/workouts/:workoutId",
  auth,
  async (req, res) => {
    const { courseId, workoutId } = req.params;
    const { progressData } = req.body;
    try {
      const user = req.user;
      const course = user.courses.find(
        (c) => String(c.courseId) === String(courseId)
      );
      if (!course) return res.status(404).json({ message: "Курс не найден" });

      // Найти текущий воркаут-прогресс или создать его
      let workout = (course.workoutsProgress ||= []).find(
        (w) => String(w.workoutId) === String(workoutId)
      );

      if (!workout) {
        workout = {
          workoutId,
          progressData,
          workoutCompleted: false,
        };
        course.workoutsProgress.push(workout);
      } else {
        workout.progressData = progressData;
        workout.workoutCompleted = progressData.every((x) => x > 0); // критерий "сделан"
      }

      // Обновить course.progress (числовой %) если нужно
      // Можно, например, считать процент выполненных воркаутов из workoutsProgress...

      await user.save();
      res.json({ message: "Прогресс обновлен!", workout });
    } catch (e) {
      res.status(500).json({ message: "Ошибка обновления прогресса" });
    }
  }
);

// --- Сбросить прогресс тренировки ---
router.patch(
  "/courses/:courseId/workouts/:workoutId/reset",
  auth,
  async (req, res) => {
    const { courseId, workoutId } = req.params;
    try {
      const user = req.user;
      const course = user.courses.find(
        (c) => String(c.courseId) === String(courseId)
      );
      if (!course) return res.status(404).json({ message: "Курс не найден" });

      course.workoutsProgress = (course.workoutsProgress || []).filter(
        (w) => String(w.workoutId) !== String(workoutId)
      );
      // (или просто занулить progressData/флаг, если не хочешь удалять)
      await user.save();
      res.json({ message: "Прогресс тренировки удалён!" });
    } catch (e) {
      res.status(500).json({ message: "Ошибка сброса" });
    }
  }
);

module.exports = router;
