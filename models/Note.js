const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: false,
    },
    completed: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Note', noteSchema);