/**
 * Основний файл додатку Express для системи підготовки наукових видань
 * Файл: src/app.js
 */

// Імпорт залежностей
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Завантаження змінних середовища
// Важливо: це має бути до використання process.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Ініціалізація додатку Express
const app = express();

// Налаштування MongoDB (з надійним резервним варіантом)
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/scientific-journal';
mongoose.connect(mongoUri)
  .then(() => {
    console.log('Підключено до бази даних MongoDB');
  })
  .catch((err) => {
    console.error('Помилка підключення до MongoDB:', err.message);
    // Спроба підключитися до MongoDB локально, якщо стандартний спосіб не працює
    mongoose.connect('mongodb://127.0.0.1:27017/scientific-journal')
      .then(() => {
        console.log('Підключено до локальної бази даних MongoDB');
      })
      .catch((error) => {
        console.error('Не вдалося підключитися до MongoDB:', error.message);
      });
  });

// Middleware для обробки даних
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Безпека та CORS
app.use(cors());
app.use(helmet()); // Захист HTTP заголовків

// Логування запитів
app.use(morgan('dev'));

// Статичні файли (для завантажених документів)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Базовий маршрут для перевірки роботи API
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API системи підготовки наукових видань працює',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Конфігурація API маршрутів
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/manuscripts', require('./routes/manuscriptRoutes'));
app.use('/api/v1/journals', require('./routes/journalRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/reviews', require('./routes/reviewRoutes'));

// Обробка неіснуючих маршрутів (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ресурс не знайдено'
  });
});

// Глобальний обробник помилок
app.use((err, req, res, next) => {
  console.error('Помилка сервера:', err);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Внутрішня помилка сервера',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = app;