const express = require("express");
const router = express.Router();

// Модели
const Course = require("../models/Course");
const User = require("../models/User");
const Workout = require("../models/Workout");
const auth = require("../middleware/auth");

// ========== Получить все курсы ==========
router.get("/fitness/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
});

// Получить курс по slug (например, /api/courses/bodyflex)
router.get("/courses/:slugString", async (req, res) => {
  try {
    const course = await Course.findOne({
      slug: req.params.slugString,
    }).populate("workouts");
    if (!course) return res.status(404).json({ message: "Курс не найден" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
});

// ========== Получить список тренировок курса ==========
router.get("/fitness/courses/:courseId/workouts", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Курс не найден" });

    const workouts = await Workout.find({ _id: { $in: course.workouts } });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
});

// ========== Добавить курс пользователю ==========
router.post("/fitness/users/me/courses", auth, async (req, res) => {
  try {
    // предполагается, что userId есть в req.user (JWT middleware)
    const userId = req.user._id;
    const { courseId } = req.body;

    // валидировать courseId, userId
    if (!userId) return res.status(401).json({ message: "Неавторизован" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Курс не найден" });

    // Найти пользователя и добавить курс, если не был добавлен
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Пользователь не найден" });

    if (user.courses?.find((c) => c.courseId?.toString() === courseId)) {
      return res.status(400).json({ message: "Курс уже добавлен!" });
    }

    user.courses = [...(user.courses || []), { courseId, progress: 0 }];
    await user.save();

    res.json({ message: "Курс успешно добавлен!" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
});

// ========== Удалить курс у пользователя ==========
router.delete("/fitness/users/me/courses/:courseId", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.courseId;

    if (!userId) return res.status(401).json({ message: "Неавторизован" });

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Пользователь не найден" });

    user.courses = user.courses.filter(
      (c) => c.courseId.toString() !== courseId
    );
    await user.save();
    res.json({ message: "Курс успешно удален!" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
});

// ========== Удалить прогресс по курсу пользователя ==========
router.patch("/fitness/courses/:courseId/reset", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.courseId;

    if (!userId) return res.status(401).json({ message: "Неавторизован" });

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Пользователь не найден" });

    let found = false;
    user.courses = user.courses.map((c) => {
      if (c.courseId.toString() === courseId) {
        found = true;
        return { ...c, progress: 0 };
      }
      return c;
    });
    if (!found)
      return res.status(404).json({ message: "Курс не найден у пользователя" });

    await user.save();
    res.json({ message: "Прогресс курса удалён!" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
});

// ========== СОЗДАТЬ КУРС ==========
router.post("/fitness/courses", async (req, res) => {
  try {
    const { nameRU, description, slug } = req.body;
    if (!nameRU) {
      return res.status(400).json({ message: "Имя курса обязательно" });
    }
    const newCourse = new Course({ nameRU, description, slug });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
});

// ========== УДАЛИТЬ КУРС ИЗ БАЗЫ ==========
router.delete("/fitness/courses/:courseId", async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const deleted = await Course.findByIdAndDelete(courseId);

    if (!deleted) {
      return res.status(404).json({ message: "Курс не найден" });
    }

    res.json({ message: "Курс успешно удалён!" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
});

// ========== Получить ВСЕ курсы пользователя ==========
router.get("/fitness/users/me/courses", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) return res.status(401).json({ message: "Неавторизован" });

    // Получить пользователя с массивом курсов
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Пользователь не найден" });

    // Преобразуем массив user.courses ([] с courseId, progress)
    // и приклеиваем внутрь нужные данные курса (title, image etc)
    // -- Самый читаемый вариант: populate + map
    const response = await Promise.all(
      (user.courses || []).map(async (uc) => {
        const course = await Course.findById(uc.courseId);
        if (!course) return null;
        return {
          courseId: uc.courseId,
          slug: course.slug, // 💡 эти поля должны быть в Course!
          title: course.title, // или nameRU, если у тебя другое имя поля
          image: course.image,
          days: course.days,
          time: course.time,
          progress: uc.progress,
        };
      })
    );

    // Убрать все пустые (если какого-то курса уже нет в базе)
    res.json({
      courses: response.filter(Boolean),
    });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
});
// == Получить курс по ID с тренировками (populate!)
router.get("/fitness/courses/:courseId", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate(
      "workouts"
    ); // <-- магия!
    if (!course) return res.status(404).json({ message: "Курс не найден" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
});
// PATCH — обновить тренировки курса
router.patch("/fitness/courses/:courseId", async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.courseId,
      { workouts: req.body.workouts },
      { new: true }
    );
    if (!course) return res.status(404).json({ message: "Курс не найден" });
    res.json(course);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Ошибка при обновлении", error: err.message });
  }
});

module.exports = router;
