const express = require('express');
const router = express.Router();
const { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer, addPayment } = require('../controllers/customerController');
const { getNotes, addNote } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getCustomers)
  .post(protect, createCustomer);

router.route('/:id')
  .get(protect, getCustomerById)
  .put(protect, updateCustomer)
  .delete(protect, deleteCustomer);

// Note routes related to a specific customer
router.route('/:customerId/notes')
  .get(protect, getNotes)
  .post(protect, addNote);

// Payment route
router.route('/:id/payments')
  .post(protect, addPayment);

module.exports = router;
