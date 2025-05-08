const Manuscript = require('../models/Manuscript');
const User = require('../models/User');

// @desc    Отримати всі рукописи
// @route   GET /api/v1/manuscripts
// @access  Private
exports.getManuscripts = async (req, res, next) => {
  try {
    let query;
    
    // Якщо користувач не адміністратор, показувати тільки власні рукописи
    if (req.user.role !== 'admin' && req.user.role !== 'editor') {
      query = Manuscript.find({ author: req.user.id });
    } else {
      query = Manuscript.find();
    }
    
    // Додаємо сортування, вибір полів і т.д.
    const manuscripts = await query.sort('-submittedAt').populate('author', 'name email');
    
    res.status(200).json({
      success: true,
      count: manuscripts.length,
      data: manuscripts
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Отримати окремий рукопис
// @route   GET /api/v1/manuscripts/:id
// @access  Private
exports.getManuscript = async (req, res, next) => {
  try {
    const manuscript = await Manuscript.findById(req.params.id)
      .populate('author', 'name email')
      .populate('journal', 'name issn');
      
    if (!manuscript) {
      return res.status(404).json({
        success: false,
        message: 'Рукопис не знайдено'
      });
    }
    
    // Перевірка прав доступу
    if (manuscript.author.toString() !== req.user.id && 
        req.user.role !== 'admin' && 
        req.user.role !== 'editor') {
      return res.status(403).json({
        success: false,
        message: 'У вас немає доступу до цього рукопису'
      });
    }
    
    res.status(200).json({
      success: true,
      data: manuscript
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Створити новий рукопис
// @route   POST /api/v1/manuscripts
// @access  Private
exports.createManuscript = async (req, res, next) => {
  try {
    // Додати автора до даних рукопису
    req.body.author = req.user.id;
    
    const manuscript = await Manuscript.create(req.body);
    
    res.status(201).json({
      success: true,
      data: manuscript
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Оновити рукопис
// @route   PUT /api/v1/manuscripts/:id
// @access  Private
exports.updateManuscript = async (req, res, next) => {
  try {
    let manuscript = await Manuscript.findById(req.params.id);
    
    if (!manuscript) {
      return res.status(404).json({
        success: false,
        message: 'Рукопис не знайдено'
      });
    }
    
    // Перевірка прав доступу
    if (manuscript.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'У вас немає доступу редагувати цей рукопис'
      });
    }
    
    manuscript = await Manuscript.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: manuscript
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Видалити рукопис
// @route   DELETE /api/v1/manuscripts/:id
// @access  Private
exports.deleteManuscript = async (req, res, next) => {
  try {
    const manuscript = await Manuscript.findById(req.params.id);
    
    if (!manuscript) {
      return res.status(404).json({
        success: false,
        message: 'Рукопис не знайдено'
      });
    }
    
    // Перевірка прав доступу
    if (manuscript.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'У вас немає доступу видалити цей рукопис'
      });
    }
    
    await manuscript.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};