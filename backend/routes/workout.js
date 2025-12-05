const express = require("express");
const router = express.Router();
const Workout = require("../models/Workout");

// GET /api/fitness/workouts/:id
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

// ДОбавь этот эндпоинт 👇
router.post("/", async (req, res) => {
  try {
    // Берем данные из тела запроса
    const { name, exercises } = req.body;
    const workout = new Workout({ name, exercises: exercises || [] });
    await workout.save();
    res.status(201).json(workout);
  } catch (e) {
    res.status(400).json({ message: "Ошибка при создании тренировки" });
  }
});
// GET /api/fitness/workouts
router.get("/", async (req, res) => {
  try {
    const workouts = await Workout.find({});
    res.json(workouts);
  } catch (e) {
    res.status(500).json({ message: "Ошибка загрузки тренировок" });
  }
});

module.exports = router;
