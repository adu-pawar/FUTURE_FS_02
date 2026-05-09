const express = require('express');
const router = express.Router();
const { updateNote, deleteNote } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:noteId')
  .put(protect, updateNote)
  .delete(protect, deleteNote);

module.exports = router;
