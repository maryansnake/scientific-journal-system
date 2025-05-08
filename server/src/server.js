const app = require('./app');
const dotenv = require('dotenv');

// Завантаження змінних середовища з файлу .env
dotenv.config();

// Порт для запуску сервера
const PORT = process.env.PORT || 5000;

// Запуск сервера
const server = app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});

// Обробка необроблених винятків
process.on('unhandledRejection', (err) => {
  console.error(`Помилка: ${err.message}`);
  // Закриття сервера і завершення процесу
  server.close(() => process.exit(1));
});