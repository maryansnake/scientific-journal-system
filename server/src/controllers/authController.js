const User = require('../models/User');

/**
 * @desc    Реєстрація нового користувача
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, institution } = req.body;

    // Перевірка, чи існує вже користувач з такою електронною поштою
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Користувач з такою електронною поштою вже існує'
      });
    }

    // Створення нового користувача
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'author', // За замовчуванням "автор"
      institution
    });

    // Отримання JWT токена
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Вхід користувача
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Перевірка наявності email та password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Будь ласка, вкажіть електронну пошту та пароль'
      });
    }

    // Пошук користувача
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Невірні облікові дані'
      });
    }

    // Перевірка паролю
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Невірні облікові дані'
      });
    }

    // Отримання JWT токена
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Отримання даних поточного користувача
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Вихід користувача (на стороні клієнта)
 * @route   GET /api/v1/auth/logout
 * @access  Private
 */
exports.logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Вихід успішно виконано'
  });
};