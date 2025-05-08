const express = require('express');
const {
  getJournals,
  getJournal,
  createJournal,
  updateJournal,
  deleteJournal
} = require('../controllers/journalController');

const router = express.Router();

// Middleware для захисту маршрутів
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getJournals)
  .post(protect, authorize('admin', 'editor'), createJournal);

router
  .route('/:id')
  .get(getJournal)
  .put(protect, authorize('admin', 'editor'), updateJournal)
  .delete(protect, authorize('admin'), deleteJournal);

module.exports = router;