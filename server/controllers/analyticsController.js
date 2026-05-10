const asyncHandler = require('express-async-handler');
const Customer = require('../models/Customer');

// @desc    Get dashboard analytics
// @route   GET /api/analytics
// @access  Private
const getAnalytics = asyncHandler(async (req, res) => {
  const mongoose = require('mongoose');
  const userId = new mongoose.Types.ObjectId(req.user.id);

  const totalCustomers = await Customer.countDocuments({ user: req.user._id });
  const newCustomers = await Customer.countDocuments({ user: req.user._id, status: 'New' });
  const contactedCustomers = await Customer.countDocuments({ user: req.user._id, status: 'Contacted' });
  const convertedCustomers = await Customer.countDocuments({ user: req.user._id, status: 'Converted' });
  
  // Status Distribution
  const statusDistribution = await Customer.aggregate([
    { $match: { user: userId } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  
  // Monthly Growth (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const monthlyGrowth = await Customer.aggregate([
    { $match: { user: userId, createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.status(200).json({
    cards: { totalCustomers, newCustomers, contactedCustomers, convertedCustomers },
    statusDistribution,
    monthlyGrowth,
  });
});

module.exports = {
  getAnalytics,
};
