const mongoose = require('mongoose');

const JournalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Будь ласка, вкажіть назву журналу'],
    unique: true,
    trim: true
  },
  abbreviation: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Будь ласка, додайте опис журналу']
  },
  issn: {
    print: {
      type: String,
      trim: true
    },
    electronic: {
      type: String,
      trim: true
    }
  },
  publisher: {
    type: String,
    required: [true, 'Будь ласка, вкажіть видавця']
  },
  editorInChief: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  editors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  sections: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    editors: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }],
  reviewers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  peerReviewProcess: {
    type: String,
    enum: ['single_blind', 'double_blind', 'open', 'editorial_review'],
    default: 'double_blind'
  },
  reviewerGuidelines: {
    type: String
  },
  authorGuidelines: {
    type: String
  },
  submissionChecklist: [{
    text: String,
    required: {
      type: Boolean,
      default: true
    }
  }],
  coverImage: {
    fileName: String,
    filePath: String
  },
  contactEmail: {
    type: String,
    required: [true, 'Будь ласка, вкажіть контактний email']
  },
  website: {
    type: String,
    match: [
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      'Будь ласка, вкажіть коректну URL-адресу'
    ]
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Journal', JournalSchema);