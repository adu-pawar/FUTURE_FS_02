const asyncHandler = require('express-async-handler');
const Customer = require('../models/Customer');

// @desc    Submit a contact form (Public)
// @route   POST /api/public/contact
// @access  Public
const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, phone, company, message } = req.body;

  if (!name || !email) {
    res.status(400);
    throw new Error('Please add a name and email');
  }

  const customer = await Customer.create({
    name,
    email,
    phone,
    company,
    message,
    source: 'Website Contact Form',
    status: 'New',
  });

  res.status(201).json({ message: 'Customer submitted successfully', customerId: customer._id });
});

module.exports = {
  submitContactForm,
};
