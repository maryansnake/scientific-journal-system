const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  manuscript: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manuscript',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Будь ласка, додайте текст рецензії']
  },
  score: {
    type: Number,
    required: [true, 'Будь ласка, оцініть рукопис'],
    min: 1,
    max: 10
  },
  recommendation: {
    type: String,
    required: [true, 'Будь ласка, вкажіть рекомендацію'],
    enum: ['Прийняти без змін', 'Прийняти з незначними змінами', 'Переробити та надіслати повторно', 'Відхилити']
  },
  comments: {
    type: String
  },
  isConfidential: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Review', ReviewSchema);