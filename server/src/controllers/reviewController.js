const Review = require('../models/Review');
const Manuscript = require('../models/Manuscript');
const User = require('../models/User');

// @desc    Отримати всі рецензії
// @route   GET /api/v1/reviews
// @route   GET /api/v1/manuscripts/:manuscriptId/reviews
// @access  Private
exports.getReviews = async (req, res, next) => {
  try {
    let query;

    // Перевірка, чи зазначено конкретний рукопис
    if (req.params.manuscriptId) {
      // Якщо так, то отримуємо всі рецензії для цього рукопису
      query = Review.find({ manuscript: req.params.manuscriptId });
    } else {
      // Інакше, залежно від ролі користувача
      if (req.user.role === 'admin' || req.user.role === 'editor') {
        // Адміністратори та редактори бачать усі рецензії
        query = Review.find();
      } else if (req.user.role === 'reviewer') {
        // Рецензенти бачать тільки свої рецензії
        query = Review.find({ reviewer: req.user.id });
      } else {
        // Автори бачать рецензії на свої рукописи
        const manuscripts = await Manuscript.find({ author: req.user.id }).select('_id');
        const manuscriptIds = manuscripts.map(m => m._id);
        query = Review.find({ manuscript: { $in: manuscriptIds } });
      }
    }

    // Додаємо можливість заповнення інформацією пов'язаних моделей
    query = query.populate({
      path: 'manuscript',
      select: 'title status',
      populate: {
        path: 'author',
        select: 'name'
      }
    }).populate({
      path: 'reviewer',
      select: 'name'
    });

    const reviews = await query;

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Отримати одну рецензію
// @route   GET /api/v1/reviews/:id
// @access  Private
exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate({
        path: 'manuscript',
        select: 'title status author',
        populate: {
          path: 'author',
          select: 'name'
        }
      })
      .populate({
        path: 'reviewer',
        select: 'name'
      });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Рецензію не знайдено'
      });
    }

    // Перевірка прав доступу
    const manuscript = await Manuscript.findById(review.manuscript);
    
    // Доступ мають: автор рецензії, автор рукопису, адміністратори та редактори
    if (
      req.user.id !== review.reviewer.toString() && 
      req.user.id !== manuscript.author.toString() && 
      req.user.role !== 'admin' && 
      req.user.role !== 'editor'
    ) {
      return res.status(403).json({
        success: false,
        message: 'У вас немає доступу до цієї рецензії'
      });
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Створити рецензію
// @route   POST /api/v1/manuscripts/:manuscriptId/reviews
// @access  Private (Reviewer, Admin, Editor)
exports.createReview = async (req, res, next) => {
  try {
    // Перевірка наявності рукопису
    const manuscript = await Manuscript.findById(req.params.manuscriptId);
    
    if (!manuscript) {
      return res.status(404).json({
        success: false,
        message: 'Рукопис не знайдено'
      });
    }

    // Перевірка, чи є користувач рецензентом
    if (req.user.role !== 'reviewer' && req.user.role !== 'admin' && req.user.role !== 'editor') {
      return res.status(403).json({
        success: false,
        message: 'Тільки рецензенти можуть створювати рецензії'
      });
    }

    // Перевірка, чи не існує вже рецензія від цього рецензента
    const existingReview = await Review.findOne({
      manuscript: req.params.manuscriptId,
      reviewer: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Ви вже створили рецензію для цього рукопису'
      });
    }

    // Додаємо manuscriptId і reviewerId до тіла запиту
    req.body.manuscript = req.params.manuscriptId;
    req.body.reviewer = req.user.id;

    // Створюємо рецензію
    const review = await Review.create(req.body);

    // Оновлення статусу рукопису, якщо потрібно
    if (req.body.recommendation === 'Відхилити') {
      manuscript.status = 'Відхилено';
      await manuscript.save();
    } else if (req.body.recommendation === 'Переробити та надіслати повторно') {
      manuscript.status = 'Потребує доопрацювання';
      await manuscript.save();
    }

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Оновити рецензію
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Рецензію не знайдено'
      });
    }
    
    // Перевірка прав доступу (тільки автор рецензії може її редагувати)
    if (review.reviewer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Тільки автор рецензії може її редагувати'
      });
    }
    
    // Оновлення рецензії
    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    // Оновлення статусу рукопису при необхідності
    if (req.body.recommendation) {
      const manuscript = await Manuscript.findById(review.manuscript);
      
      if (req.body.recommendation === 'Відхилити') {
        manuscript.status = 'Відхилено';
        await manuscript.save();
      } else if (req.body.recommendation === 'Переробити та надіслати повторно') {
        manuscript.status = 'Потребує доопрацювання';
        await manuscript.save();
      } else if (req.body.recommendation === 'Прийняти без змін' || req.body.recommendation === 'Прийняти з незначними змінами') {
        // Потрібно перевірити інші рецензії
        const otherReviews = await Review.find({
          manuscript: manuscript._id,
          _id: { $ne: review._id }
        });
        
        // Якщо всі рецензії рекомендують прийняття
        const allAccept = otherReviews.every(r => 
          r.recommendation === 'Прийняти без змін' || 
          r.recommendation === 'Прийняти з незначними змінами'
        );
        
        if (allAccept) {
          manuscript.status = 'Прийнято';
          await manuscript.save();
        }
      }
    }
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Видалити рецензію
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Рецензію не знайдено'
      });
    }
    
    // Перевірка прав доступу (тільки автор рецензії або адмін може її видаляти)
    if (review.reviewer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Тільки автор рецензії або адміністратор може її видаляти'
      });
    }
    
    await review.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Призначити рецензента для рукопису
// @route   POST /api/v1/manuscripts/:manuscriptId/assign-reviewer/:userId
// @access  Private (Admin, Editor)
exports.assignReviewer = async (req, res, next) => {
  try {
    // Перевірка наявності рукопису
    const manuscript = await Manuscript.findById(req.params.manuscriptId);
    
    if (!manuscript) {
      return res.status(404).json({
        success: false,
        message: 'Рукопис не знайдено'
      });
    }
    
    // Перевірка прав доступу
    if (req.user.role !== 'admin' && req.user.role !== 'editor') {
      return res.status(403).json({
        success: false,
        message: 'Тільки адміністратор або редактор може призначати рецензентів'
      });
    }
    
    // Перевірка наявності користувача
    const reviewer = await User.findById(req.params.userId);
    
    if (!reviewer) {
      return res.status(404).json({
        success: false,
        message: 'Користувача не знайдено'
      });
    }
    
    // Перевірка, чи є користувач рецензентом
    if (reviewer.role !== 'reviewer') {
      return res.status(403).json({
        success: false,
        message: 'Обраний користувач не є рецензентом'
      });
    }
    
    // Перевірка, чи не є рецензент автором рукопису
    if (manuscript.author.toString() === reviewer._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Автор рукопису не може бути його рецензентом'
      });
    }
    
    // Перевірка, чи не призначений вже цей рецензент
    const existingAssignment = await Review.findOne({
      manuscript: req.params.manuscriptId,
      reviewer: req.params.userId
    });
    
    if (existingAssignment) {
      return res.status(400).json({
        success: false,
        message: 'Цей рецензент вже призначений для даного рукопису'
      });
    }
    
    // Створення запису про призначення (порожня рецензія)
    const review = await Review.create({
      manuscript: req.params.manuscriptId,
      reviewer: req.params.userId,
      content: '',
      score: 0,
      recommendation: 'Очікує рецензування',
      comments: 'Рецензія ще не надана'
    });
    
    // Оновлення статусу рукопису
    manuscript.status = 'На рецензуванні';
    await manuscript.save();
    
    res.status(201).json({
      success: true,
      data: review
    });
  } catch (err) {
    next(err);
  }
};