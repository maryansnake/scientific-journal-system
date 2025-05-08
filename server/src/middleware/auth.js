const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Захист маршрутів
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Перевірка наявності токена в заголовках
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Перевірка, чи токен існує
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Відсутній токен авторизації'
      });
    }

    try {
      // Верифікація токена
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Отримання користувача з бази даних
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Користувача не знайдено'
        });
      }

      // Додавання користувача до об'єкта запиту
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Недійсний токен авторизації'
      });
    }
  } catch (error) {
    next(error);
  }
};

// Перевірка ролі користувача
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Роль ${req.user.role} не має доступу до цього ресурсу`
      });
    }
    next();
  };
};