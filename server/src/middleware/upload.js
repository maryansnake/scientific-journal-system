const path = require('path');
const multer = require('multer');

// Налаштування зберігання файлів
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/manuscripts/');
  },
  filename: function(req, file, cb) {
    cb(
      null, 
      `manuscript-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`
    );
  }
});

// Функція фільтрації файлів (тільки PDF)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Дозволено завантажувати тільки PDF файли!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 МБ
  }
});

module.exports = upload;