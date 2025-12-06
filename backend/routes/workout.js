const express = require("express");
const router = express.Router();
const Workout = require("../models/Workout");

// 🟢 Получить одну тренировку
router.get("/:id", async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout)
      return res.status(404).json({ message: "Тренировка не найдена" });
    res.json(workout);
  } catch (e) {
    res.status(400).json({ message: "Ошибка получения тренировки" });
  }
});

// 🟢 Получить все тренировки
router.get("/", async (req, res) => {
  try {
    const workouts = await Workout.find({});
    res.json(workouts);
  } catch (e) {
    res.status(500).json({ message: "Ошибка загрузки тренировок" });
  }
});

// 🟢 СОЗДАТЬ тренировку (POST)
router.post("/", async (req, res) => {
  try {
    // Данные в теле запроса
    const { name, exercises, video } = req.body;
    const workout = new Workout({ name, exercises: exercises || [], video });
    await workout.save();
    res.status(201).json(workout);
  } catch (e) {
    res.status(400).json({ message: "Ошибка при создании тренировки" });
  }
});

// (по желанию) PATCH, DELETE — по структуре похожи

module.exports = router;
