const mongoose = require("mongoose");

const WorkoutSchema = new mongoose.Schema({
  name: String,
  video: String, // ссылка на видео
  exercises: [
    {
      name: String,
      quantity: Number,
    },
  ],
  // ...доп поля, если надо
});

module.exports = mongoose.model("Workout", WorkoutSchema);
