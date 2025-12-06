require("dotenv").config(); // Всегда первой строчкой
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const progressRouter = require("./routes/progress");
const workoutsRouter = require("./routes/workout");

mongoose
  .connect("mongodb://127.0.0.1:27017/fitness")
  .then(() => console.log("MongoDB подключен!"))
  .catch((err) => console.error("Ошибка подключения:", err));

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

const authRouter = require("./routes/auth");
app.use("/api/fitness/auth", authRouter);
app.use("/api", require("./routes/course"));
app.use("/api/fitness/users/me/progress", progressRouter);
app.use("/api/fitness/workouts", workoutsRouter);
app.use("/api/fitness", progressRouter);

app.listen(4000, () => console.log("Backend стартовал на 4000"));
