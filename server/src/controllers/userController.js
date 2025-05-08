const User = require('../models/User');

// @desc    Отримати всіх користувачів
// @route   GET /api/v1/users
// @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Отримати окремого користувача
// @route   GET /api/v1/users/:id
// @access  Private (Admin/Self)
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Користувача не знайдено'
      });
    }
    
    // Дозволити доступ тільки адміну або самому користувачу
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Немає дозволу на перегляд цього користувача'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Редагувати профіль користувача
// @route   PUT /api/v1/users/:id
// @access  Private (Admin/Self)
exports.updateUser = async (req, res, next) => {
  try {
    // Перевірка прав доступу
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Немає дозволу на редагування цього користувача'
      });
    }
    
    // Забороняємо зміну ролі, якщо не адмін
    if (req.body.role && req.user.role !== 'admin') {
      delete req.body.role;
    }
    
    // Забороняємо змінювати пароль через цей маршрут
    if (req.body.password) {
      delete req.body.password;
    }
    
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Користувача не знайдено'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Видалити користувача
// @route   DELETE /api/v1/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    // Тільки адмін може видаляти користувачів
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Тільки адміністратор може видаляти користувачів'
      });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Користувача не знайдено'
      });
    }
    
    await user.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Змінити роль користувача
// @route   PUT /api/v1/users/:id/role
// @access  Private (Admin)
exports.changeUserRole = async (req, res, next) => {
  try {
    // Тільки адмін може змінювати ролі
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Тільки адміністратор може змінювати ролі користувачів'
      });
    }
    
    const { role } = req.body;
    
    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Будь ласка, вкажіть роль'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Користувача не знайдено'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};