const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

module.exports = async function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Нет токена" });

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET); // userId & email
    console.log("DECODED PAYLOAD:", payload);

    // Найди пользователя в базе и положи его в req.user!
    const user = await User.findById(payload.userId);
    console.log("USER FROM DB:", user);
    console.log("DECODED PAYLOAD:", payload);
    if (!user)
      return res.status(401).json({ message: "Пользователь не найден" });

    req.user = user; // теперь твои руты будут работать!
    next();
  } catch (e) {
    return res.status(401).json({ message: "Неверный токен" });
  }
};
