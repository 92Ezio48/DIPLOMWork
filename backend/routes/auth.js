const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Помощник по валидации email
function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

// Помощник по валидации пароля
function validatePassword(password) {
  if (password.length < 6) return "Пароль должен содержать не менее 6 символов";
  if ((password.match(/[^a-zA-Z0-9]/g) || []).length < 2)
    return "Пароль должен содержать не менее 2 спецсимволов";
  if (!/[A-Z]/.test(password))
    return "Пароль должен содержать как минимум одну заглавную букву";
  return null;
}

// ========== РЕГИСТРАЦИЯ ==========
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!isValidEmail(email)) {
      return res.status(404).json({ message: "Введите корректный Email" });
    }

    // Проверка на уникальность email
    const existed = await User.findOne({ email });
    if (existed) {
      return res
        .status(404)
        .json({ message: "Пользователь с таким email уже существует" });
    }

    // Проверка валидности пароля
    const passError = validatePassword(password);
    if (passError) {
      return res.status(404).json({ message: passError });
    }

    // Хэшируем пароль
    const hashPassword = await bcrypt.hash(password, 10);

    // Создаём пользователя
    const user = new User({ email, password: hashPassword });
    await user.save();

    return res.json({ message: "Регистрация прошла успешно!" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Ошибка регистрации", error: err.message });
  }
});

// ========== АВТОРИЗАЦИЯ ==========
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Проверяем есть ли такой пользователь
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Пользователь с таким email не найден" });
    }

    // Сравниваем пароли
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ message: "Неверный пароль" });
    }

    // Генерируем JWT токен (expiresIn: 7d)
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    return res.json({ token });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Ошибка авторизации", error: err.message });
  }
});

// ========== СПИСОК ПОЛЬЗОВАТЕЛЕЙ ==========
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
});
console.log("JWT_SECRET in login:", JWT_SECRET);
module.exports = router;
