const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  nameRU: { type: String, required: true },
  nameEN: { type: String },
  description: { type: String },
  directions: [String],
  fitting: [String],
  difficulty: { type: String },
  durationInDays: { type: Number },
  dailyDurationInMinutes: {
    from: Number,
    to: Number,
  },
  workouts: [{ type: Schema.Types.ObjectId, ref: "Workout" }],
  slug: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("Course", CourseSchema);
