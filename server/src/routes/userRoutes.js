const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changeUserRole
} = require('../controllers/userController');

const router = express.Router();

// Middleware для захисту маршрутів
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, authorize('admin'), getUsers);

router
  .route('/:id')
  .get(protect, getUser)
  .put(protect, updateUser)
  .delete(protect, authorize('admin'), deleteUser);

router
  .route('/:id/role')
  .put(protect, authorize('admin'), changeUserRole);

module.exports = router;