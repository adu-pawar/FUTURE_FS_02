const mongoose = require('mongoose');

const leadSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
    },
    phone: {
      type: String,
      required: false,
    },
    company: {
      type: String,
      required: false,
    },
    source: {
      type: String,
      required: true,
      default: 'Website Contact Form',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Converted', 'Closed'],
      default: 'New',
    },
    message: {
      type: String,
      required: false,
    },
    followUps: [
      {
        date: { type: Date },
        message: { type: String },
        completed: { type: Boolean, default: false },
      },
    ],
    // Payment Tracking Fields
    totalAmount: {
      type: Number,
      default: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    pendingAmount: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Partial', 'Overdue'],
      default: 'Pending',
    },
    payments: [
      {
        paymentDate: { type: Date, default: Date.now },
        paymentMethod: { type: String, enum: ['Cash', 'Bank Transfer', 'UPI', 'Card', 'Cheque', 'Other'], default: 'Bank Transfer' },
        transactionId: { type: String },
        amountPaid: { type: Number, required: true },
        note: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Auto-calculate pending amount and status before saving
leadSchema.pre('save', async function () {
  const payments = this.payments || [];
  
  if (this.totalAmount > 0 || payments.length > 0) {
    this.paidAmount = payments.reduce((sum, p) => sum + p.amountPaid, 0);
    this.pendingAmount = (this.totalAmount || 0) - this.paidAmount;

    if (this.paidAmount >= (this.totalAmount || 0) && (this.totalAmount || 0) > 0) {
      this.paymentStatus = 'Paid';
    } else if (this.paidAmount > 0) {
      this.paymentStatus = 'Partial';
    } else {
      this.paymentStatus = 'Pending';
    }
  } else {
    this.paidAmount = 0;
    this.pendingAmount = 0;
    this.paymentStatus = 'Pending';
  }
});

module.exports = mongoose.model('Customer', leadSchema);
