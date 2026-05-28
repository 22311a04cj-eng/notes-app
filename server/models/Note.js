const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, default: '' },
  tags: [{ type: String, trim: true }],
  isPinned: { type: Boolean, default: false },
  color: { type: String, default: '#ffffff' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);