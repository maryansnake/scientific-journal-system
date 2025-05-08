const express = require('express');
const {
  getManuscripts,
  getManuscript,
  createManuscript,
  updateManuscript,
  deleteManuscript
} = require('../controllers/manuscriptController');

const {
  uploadManuscriptFile,
  getManuscriptFile
} = require('../controllers/manuscriptUploadController');

// Включення маршрутів рецензій
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// Middleware для захисту маршрутів
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Перенаправлення на маршрути рецензій
router.use('/:manuscriptId/reviews', reviewRouter);

router
  .route('/')
  .get(protect, getManuscripts)
  .post(protect, authorize('author', 'admin'), createManuscript);

router
  .route('/:id')
  .get(protect, getManuscript)
  .put(protect, updateManuscript)
  .delete(protect, deleteManuscript);

// Маршрути для роботи з файлами рукописів
router
  .route('/:id/upload')
  .post(protect, upload.single('manuscript'), uploadManuscriptFile);

router
  .route('/:id/file')
  .get(protect, getManuscriptFile);

// Маршрут для призначення рецензента
router
  .route('/:manuscriptId/assign-reviewer/:userId')
  .post(
    protect, 
    authorize('admin', 'editor'),
    require('../controllers/reviewController').assignReviewer
  );

module.exports = router;