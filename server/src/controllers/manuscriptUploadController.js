const Manuscript = require('../models/Manuscript');

// @desc    Завантажити PDF файл рукопису
// @route   POST /api/v1/manuscripts/:id/upload
// @access  Private
exports.uploadManuscriptFile = async (req, res, next) => {
  try {
    // Перевірити, чи існує рукопис
    const manuscript = await Manuscript.findById(req.params.id);
    
    if (!manuscript) {
      return res.status(404).json({
        success: false,
        message: 'Рукопис не знайдено'
      });
    }
    
    // Перевірити права доступу (автор або адміністратор)
    if (manuscript.author.toString() !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'У вас немає дозволу на завантаження файлу для цього рукопису'
      });
    }
    
    // Обробка помилки, якщо файл не був завантажений
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Будь ласка, завантажте PDF файл'
      });
    }
    
    // Оновити шлях до файлу в базі даних
    manuscript.file = req.file.path;
    await manuscript.save();
    
    res.status(200).json({
      success: true,
      data: {
        filePath: manuscript.file
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Отримати PDF файл рукопису
// @route   GET /api/v1/manuscripts/:id/file
// @access  Private
exports.getManuscriptFile = async (req, res, next) => {
  try {
    const manuscript = await Manuscript.findById(req.params.id);
    
    if (!manuscript) {
      return res.status(404).json({
        success: false,
        message: 'Рукопис не знайдено'
      });
    }
    
    if (!manuscript.file) {
      return res.status(404).json({
        success: false,
        message: 'Файл не знайдено'
      });
    }
    
    // Перевірка прав доступу
    if (manuscript.author.toString() !== req.user.id && 
        req.user.role !== 'admin' && 
        req.user.role !== 'editor' &&
        req.user.role !== 'reviewer') {
      return res.status(403).json({
        success: false,
        message: 'У вас немає дозволу на перегляд цього файлу'
      });
    }
    
    res.download(manuscript.file);
  } catch (err) {
    next(err);
  }
};