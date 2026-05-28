const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const protect = require('../middleware/authMiddleware');

// GET /api/notes  (with optional ?tag= filter)
router.get('/', protect, async (req, res) => {
  try {
    const filter = { user: req.user.id };
    if (req.query.tag) {
      filter.tags = req.query.tag;
    }

    const notes = await Note.find(filter).sort({ isPinned: -1, updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/notes/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/notes
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, tags, color } = req.body;
    const note = await Note.create({
      title,
      content,
      tags: tags || [],
      color: color || '#ffffff',
      user: req.user.id
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/notes/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, content, tags, color } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, content, tags, color },
      { new: true }
    );
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PATCH /api/notes/:id/pin
router.patch('/:id/pin', protect, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    note.isPinned = !note.isPinned;
    await note.save();

    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/notes/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;