const Journal = require('../models/Journal');

// @desc    Отримати всі журнали
// @route   GET /api/v1/journals
// @access  Public
exports.getJournals = async (req, res, next) => {
  try {
    const journals = await Journal.find();
    
    res.status(200).json({
      success: true,
      count: journals.length,
      data: journals
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Отримати окремий журнал
// @route   GET /api/v1/journals/:id
// @access  Public
exports.getJournal = async (req, res, next) => {
  try {
    const journal = await Journal.findById(req.params.id);
    
    if (!journal) {
      return res.status(404).json({
        success: false,
        message: 'Журнал не знайдено'
      });
    }
    
    res.status(200).json({
      success: true,
      data: journal
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Створити новий журнал
// @route   POST /api/v1/journals
// @access  Private (Admin)
exports.createJournal = async (req, res, next) => {
  try {
    // Тільки адміністратор може створювати журнали
    if (req.user.role !== 'admin' && req.user.role !== 'editor') {
      return res.status(403).json({
        success: false,
        message: 'У вас немає дозволу створювати журнали'
      });
    }
    
    const journal = await Journal.create(req.body);
    
    res.status(201).json({
      success: true,
      data: journal
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Оновити журнал
// @route   PUT /api/v1/journals/:id
// @access  Private (Admin)
exports.updateJournal = async (req, res, next) => {
  try {
    // Перевірка прав доступу
    if (req.user.role !== 'admin' && req.user.role !== 'editor') {
      return res.status(403).json({
        success: false,
        message: 'У вас немає дозволу оновлювати журнали'
      });
    }
    
    const journal = await Journal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!journal) {
      return res.status(404).json({
        success: false,
        message: 'Журнал не знайдено'
      });
    }
    
    res.status(200).json({
      success: true,
      data: journal
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Видалити журнал
// @route   DELETE /api/v1/journals/:id
// @access  Private (Admin)
exports.deleteJournal = async (req, res, next) => {
  try {
    // Перевірка прав доступу
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'У вас немає дозволу видаляти журнали'
      });
    }
    
    const journal = await Journal.findById(req.params.id);
    
    if (!journal) {
      return res.status(404).json({
        success: false,
        message: 'Журнал не знайдено'
      });
    }
    
    await journal.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};