const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  courses: [
    {
      courseId: { type: Schema.Types.ObjectId, ref: "Course" },
      progress: { type: Number, default: 0 },
      workoutsProgress: [
        // 👈 Добавь это!
        {
          workoutId: { type: String, required: true },
          workoutCompleted: { type: Boolean, default: false },
          progressData: [Number], // Например: [10, 12, 0],
        },
      ],
    },
  ],
  // если надо — добавь свои поля
});

module.exports = mongoose.model("User", userSchema);
