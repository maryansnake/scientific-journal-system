const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Будь ласка, вкажіть ім\'я'],
    trim: true,
    maxlength: [50, 'Ім\'я не може перевищувати 50 символів']
  },
  email: {
    type: String,
    required: [true, 'Будь ласка, вкажіть електронну пошту'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Будь ласка, вкажіть коректну електронну пошту'
    ]
  },
  password: {
    type: String,
    required: [true, 'Будь ласка, вкажіть пароль'],
    minlength: [6, 'Пароль повинен містити не менше 6 символів'],
    select: false
  },
  role: {
    type: String,
    enum: ['author', 'reviewer', 'editor', 'admin'],
    default: 'author'
  },
  institution: {
    type: String,
    trim: true
  },
  orcid: {
    type: String,
    trim: true
  },
  biography: {
    type: String
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Шифрування паролю перед збереженням
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Метод для створення JWT токена
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Метод для перевірки паролю
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);