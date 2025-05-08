const express = require('express');
const {
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  assignReviewer,
  createReview
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

// Middleware для захисту маршрутів
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getReviews)
  .post(protect, authorize('reviewer', 'admin', 'editor'), createReview);

router
  .route('/:id')
  .get(protect, getReview)
  .put(protect, authorize('reviewer', 'admin'), updateReview)
  .delete(protect, authorize('reviewer', 'admin'), deleteReview);

// Маршрут для призначення рецензента
router
  .route('/assign-reviewer/:userId')
  .post(protect, authorize('admin', 'editor'), assignReviewer);

module.exports = router;