const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Note = require('../models/Note');
const Customer = require('../models/Customer');

// @desc    Get notes for a customer
// @route   GET /api/customers/:customerId/notes
// @access  Private
const getNotes = asyncHandler(async (req, res) => {
  const { customerId } = req.params;

  // Verify customer belongs to user
  const customer = await Customer.findOne({ _id: customerId, user: req.user._id });
  if (!customer) {
    res.status(401);
    throw new Error('User not authorized to access these notes');
  }

  const notes = await Note.find({ customerId })
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
    
  res.status(200).json(notes);
});

// @desc    Add a note to a customer
// @route   POST /api/customers/:customerId/notes
// @access  Private
const addNote = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const { customerId } = req.params;

  if (!text) {
    res.status(400);
    throw new Error('Please add text');
  }

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    res.status(400);
    throw new Error('Invalid Customer ID format');
  }

  // Ensure customer exists and belongs to the user
  const customer = await Customer.findOne({ _id: customerId, user: req.user._id });
  if (!customer) {
    const isMemory = mongoose.connection.host === '127.0.0.1';
    res.status(404);
    throw new Error(isMemory ? 'Customer data lost or unauthorized. Please refresh.' : 'Customer not found or unauthorized');
  }

  try {
    const note = new Note({
      customerId,
      text,
      createdBy: req.user._id,
    });

    await note.save();
    const populatedNote = await note.populate('createdBy', 'name email');

    res.status(201).json(populatedNote);
  } catch (error) {
    console.error('AddNote Error:', error);
    res.status(500);
    throw new Error('Could not save note. Please try logging in again.');
  }
});

// @desc    Update a note
// @route   PUT /api/notes/:noteId
// @access  Private
const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.noteId);

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  // Verify customer belongs to user
  const customer = await Customer.findOne({ _id: note.customerId, user: req.user._id });
  if (!customer) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedNote = await Note.findByIdAndUpdate(
    req.params.noteId,
    { text: req.body.text },
    { new: true }
  ).populate('createdBy', 'name email');

  res.status(200).json(updatedNote);
});

// @desc    Delete a note
// @route   DELETE /api/notes/:noteId
// @access  Private
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.noteId);

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  // Verify customer belongs to user
  const customer = await Customer.findOne({ _id: note.customerId, user: req.user._id });
  if (!customer) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await note.deleteOne();

  res.status(200).json({ id: req.params.noteId });
});

module.exports = {
  getNotes,
  addNote,
  updateNote,
  deleteNote,
};
