const mongoose = require('mongoose');

const ManuscriptSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Будь ласка, вкажіть назву рукопису'],
    trim: true,
    maxlength: [200, 'Назва не може перевищувати 200 символів']
  },
  abstract: {
    type: String,
    required: [true, 'Будь ласка, додайте анотацію'],
    maxlength: [3000, 'Анотація не може перевищувати 3000 символів']
  },
  keywords: [{
    type: String,
    trim: true
  }],
  authors: [{
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    affiliation: String,
    isCorresponding: {
      type: Boolean,
      default: false
    }
  }],
  mainFile: {
    fileName: String,
    filePath: String,
    fileType: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  supportingFiles: [{
    fileName: String,
    filePath: String,
    fileType: String,
    description: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: [
      'draft', 
      'submitted', 
      'under_review', 
      'revision_requested', 
      'revised', 
      'accepted', 
      'rejected', 
      'published'
    ],
    default: 'draft'
  },
  submissionDate: {
    type: Date
  },
  section: {
    type: String,
    required: true
  },
  journal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Journal',
    required: true
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  handledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewAssignments: [{
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    assignedAt: {
      type: Date,
      default: Date.now
    },
    deadline: Date,
    completed: {
      type: Boolean,
      default: false
    },
    recommendedDecision: {
      type: String,
      enum: ['accept', 'minor_revisions', 'major_revisions', 'reject', '']
    }
  }],
  decisionHistory: [{
    decision: {
      type: String,
      enum: ['accept', 'minor_revisions', 'major_revisions', 'reject']
    },
    madeBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  revisionCount: {
    type: Number,
    default: 0
  },
  publicationDate: {
    type: Date
  },
  issue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Manuscript', ManuscriptSchema);