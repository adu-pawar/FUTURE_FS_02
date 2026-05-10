const asyncHandler = require('express-async-handler');
const Customer = require('../models/Customer');
const Note = require('../models/Note');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
const getCustomers = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const query = { user: req.user._id };
  
  if (status) {
    query.status = status;
  }
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ];
  }

  const customers = await Customer.find(query).sort({ createdAt: -1 });
  res.status(200).json(customers);
});

// @desc    Get customer by ID
// @route   GET /api/customers/:id
// @access  Private
const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({ _id: req.params.id, user: req.user._id });
  
  if (!customer) {
    res.status(404);
    throw new Error('Customer not found or not authorized');
  }
  
  res.status(200).json(customer);
});

// @desc    Create customer
// @route   POST /api/customers
// @access  Private
const createCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.create({
    ...req.body,
    user: req.user._id,
  });
  res.status(201).json(customer);
});

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({ _id: req.params.id, user: req.user._id });

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found or not authorized');
  }

  // Use Object.assign and save() to trigger pre-save hooks
  Object.assign(customer, req.body);
  const updatedCustomer = await customer.save();

  res.status(200).json(updatedCustomer);
});

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({ _id: req.params.id, user: req.user._id });

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found or not authorized');
  }

  await customer.deleteOne();
  
  // Also delete associated notes
  await Note.deleteMany({ customerId: req.params.id });

  res.status(200).json({ id: req.params.id });
});

// @desc    Add payment to customer
// @route   POST /api/customers/:id/payments
// @access  Private
const addPayment = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({ _id: req.params.id, user: req.user._id });

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found or not authorized');
  }

  const { amountPaid, paymentMethod, transactionId, note } = req.body;

  if (!amountPaid || amountPaid <= 0) {
    res.status(400);
    throw new Error('Please enter a valid payment amount');
  }

  customer.payments.push({
    amountPaid,
    paymentMethod: paymentMethod || 'Bank Transfer',
    transactionId,
    note,
    paymentDate: new Date(),
  });

  const updatedCustomer = await customer.save();
  res.status(201).json(updatedCustomer);
});

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  addPayment,
};
