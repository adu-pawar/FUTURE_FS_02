import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiBriefcase, FiMessageSquare, FiSend, FiDollarSign, FiCreditCard, FiHash, FiTrash2 } from 'react-icons/fi';
import api from '../services/api';
import { getColorForName, getInitials } from '../utils/colors';

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [showAmountForm, setShowAmountForm] = useState(false);
  const [tempTotalAmount, setTempTotalAmount] = useState('');
  const [paymentData, setPaymentData] = useState({
    amountPaid: '',
    paymentMethod: 'Bank Transfer',
    transactionId: '',
    note: '',
  });

  const fetchLeadData = async () => {
    try {
      setLoading(true);
      const [leadRes, notesRes] = await Promise.all([
        api.get(`/customers/${id}`),
        api.get(`/customers/${id}/notes`),
      ]);
      setLead(leadRes.data);
      setNotes(notesRes.data);
    } catch (error) {
      toast.error('Failed to fetch customer details');
      navigate('/customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadData();
  }, [id]);

  useEffect(() => {
    if (lead) {
      setEditFormData({
        name: lead.name,
        email: lead.email,
        phone: lead.phone || '',
        company: lead.company || '',
        message: lead.message || '',
      });
      setTempTotalAmount(lead.totalAmount || '');
    }
  }, [lead]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form data if canceling
      setEditFormData({
        name: lead.name,
        email: lead.email,
        phone: lead.phone || '',
        company: lead.company || '',
        message: lead.message || '',
      });
    }
    setIsEditing(!isEditing);
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/customers/${id}`, editFormData);
      setLead(res.data);
      setIsEditing(false);
      toast.success('Customer details updated');
    } catch (error) {
      toast.error('Failed to update customer details');
    }
  };

  const handleSetAmount = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/customers/${id}`, { totalAmount: parseFloat(tempTotalAmount) });
      setLead(res.data);
      setShowAmountForm(false);
      toast.success('Total amount updated');
    } catch (error) {
      toast.error('Failed to update amount');
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await api.put(`/customers/${id}`, { status: newStatus });
      setLead({ ...lead, status: newStatus });
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    const noteData = { text: newNote.trim() };
    
    try {
      console.log('Sending note to server...', { customerId: id, noteData });
      const res = await api.post(`/customers/${id}/notes`, noteData);
      
      if (res.data) {
        console.log('Note added successfully:', res.data);
        setNotes((prevNotes) => [res.data, ...prevNotes]);
        setNewNote('');
        toast.success('Note added successfully');
      }
    } catch (error) {
      console.error('Failed to add note:', error);
      const status = error.response?.status;
      const errorMsg = error.response?.data?.message || error.message;
      
      if (status === 401) {
        toast.error('Session lost. Please logout and login again.');
      } else {
        toast.error(errorMsg);
      }
    }
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/customers/${id}/payments`, {
        ...paymentData,
        amountPaid: parseFloat(paymentData.amountPaid),
      });
      setLead(res.data);
      setPaymentData({ amountPaid: '', paymentMethod: 'Bank Transfer', transactionId: '', note: '' });
      setShowPaymentForm(false);
      toast.success('Payment recorded!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add payment');
    }
  };

  const formatCurrency = (val) => `₹${(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  const getPaymentStatusColor = (status) => {
    const map = {
      Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      Paid: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      Partial: 'bg-blue-100 text-blue-800 border-blue-300',
      Overdue: 'bg-red-100 text-red-800 border-red-300',
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  };

  const handleDeleteCustomer = async () => {
    if (window.confirm('Are you sure you want to delete this customer and all associated data?')) {
      try {
        await api.delete(`/customers/${id}`);
        toast.success('Customer deleted successfully');
        navigate('/customers');
      } catch (error) {
        toast.error('Failed to delete customer');
      }
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Delete this note?')) {
      try {
        await api.delete(`/notes/${noteId}`);
        setNotes(notes.filter((note) => note._id !== noteId));
        toast.success('Note deleted');
      } catch (error) {
        toast.error('Failed to delete note');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/customers')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-800"
          >
            <FiArrowLeft />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">{lead.name}'s Profile</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDeleteCustomer}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-red-500 shadow-sm transition-all hover:bg-red-50 hover:text-red-600"
            title="Delete Customer"
          >
            <FiTrash2 />
          </button>
          <button
            onClick={handleEditToggle}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${isEditing ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-primary text-white shadow-md hover:bg-blue-600'}`}
          >
            {isEditing ? 'Cancel Edit' : 'Edit Details'}
          </button>
          <div className="flex items-center gap-2 border-l pl-3">
            <span className="text-sm font-medium text-gray-500">Status:</span>
            <select
              value={lead.status}
              onChange={handleStatusChange}
              className="rounded-lg border border-gray-200 bg-white py-2 pl-4 pr-8 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Converted">Converted</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Customer Info Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-1 rounded-2xl bg-white p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center justify-center">
            <div className={`flex h-24 w-24 items-center justify-center rounded-full ${getColorForName(lead.name).bg} ${getColorForName(lead.name).text} text-3xl font-bold shadow-lg`}>
              {getInitials(lead.name)}
            </div>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs text-gray-500">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditChange}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleEditChange}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Company</label>
                <input
                  type="text"
                  name="company"
                  value={editFormData.company}
                  onChange={handleEditChange}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Initial Message</label>
                <textarea
                  name="message"
                  value={editFormData.message}
                  onChange={handleEditChange}
                  rows="3"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-emerald-500 py-2.5 font-medium text-white shadow-lg shadow-emerald-500/30 transition-all hover:bg-emerald-600"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FiUser className="mt-1 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-800">{lead.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiMail className="mt-1 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email Address</p>
                  <a href={`mailto:${lead.email}`} className="font-medium text-primary hover:underline">
                    {lead.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiPhone className="mt-1 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Phone Number</p>
                  <p className="font-medium text-gray-800">{lead.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiBriefcase className="mt-1 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Company</p>
                  <p className="font-medium text-gray-800">{lead.company || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiMessageSquare className="mt-1 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Initial Message</p>
                  <p className="text-sm text-gray-600">{lead.message || 'No message provided'}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>        {/* Amount Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-1 rounded-2xl bg-white p-6 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Financials</h3>
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getPaymentStatusColor(lead.paymentStatus)}`}>
              {lead.paymentStatus}
            </span>
          </div>
          
          {lead.totalAmount > 0 ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-800">Total Amount</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800">{formatCurrency(lead.totalAmount)}</span>
                  <button onClick={() => setShowAmountForm(!showAmountForm)} className="text-xs text-primary hover:underline">Edit</button>
                </div>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-emerald-600">Paid Amount</span>
                <span className="font-bold text-emerald-600">{formatCurrency(lead.paidAmount)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-red-600">Pending</span>
                <span className="font-bold text-red-600">{formatCurrency(lead.pendingAmount)}</span>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-gray-500">
                  <span>Payment Progress</span>
                  <span>{Math.min((lead.paidAmount / lead.totalAmount) * 100, 100).toFixed(0)}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((lead.paidAmount / lead.totalAmount) * 100, 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${lead.paidAmount >= lead.totalAmount ? 'bg-emerald-500' : 'bg-primary'}`}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center">
              <p className="mb-4 text-sm text-gray-500">No amount has been set for this customer.</p>
              {!showAmountForm && (
                <button
                  onClick={() => setShowAmountForm(true)}
                  className="rounded-lg bg-emerald-500 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-emerald-600"
                >
                  Set Total Amount
                </button>
              )}
            </div>
          )}

          {showAmountForm && (
            <form onSubmit={handleSetAmount} className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <label className="mb-2 block text-xs font-medium text-gray-600">Total Amount (₹)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={tempTotalAmount}
                  onChange={(e) => setTempTotalAmount(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. 50000"
                  required
                />
                <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-blue-600">
                  Save
                </button>
              </div>
              <button type="button" onClick={() => setShowAmountForm(false)} className="mt-2 text-xs text-gray-400 hover:text-gray-600">Cancel</button>
            </form>
          )}
        </motion.div>

        {/* Notes Section (Moved here next to Financials) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-1 rounded-2xl bg-white p-6 shadow-sm flex flex-col"
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-800">Internal Notes</h3>
          
          {/* Add Note Form */}
          <form onSubmit={handleAddNote} className="mb-6 flex gap-2">
            <input
              type="text"
              className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
              placeholder="Add a note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <button
              type="submit"
              className="flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-white transition-all hover:bg-blue-600"
            >
              <FiSend />
            </button>
          </form>

          {/* Notes List */}
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] pr-2 scrollbar-thin scrollbar-thumb-gray-200">
            {notes.length === 0 ? (
              <p className="text-center text-xs text-gray-500">No notes added yet.</p>
            ) : (
              notes.map((note) => {
                const noteColor = getColorForName(note.createdBy?.name || 'Unknown');
                return (
                  <div key={note._id} className="group relative rounded-xl border border-gray-100 bg-gray-50 p-3 transition-all hover:bg-white hover:shadow-sm">
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="absolute right-2 top-2 hidden text-gray-400 hover:text-red-500 group-hover:block"
                      title="Delete note"
                    >
                      <FiTrash2 size={14} />
                    </button>
                    <p className="mb-2 text-xs text-gray-700">{note.text}</p>
                    <div className="flex items-center justify-between text-[10px] text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <span className={`flex h-5 w-5 items-center justify-center rounded-full ${noteColor.bg} ${noteColor.text} font-bold`}>
                          {getInitials(note.createdBy?.name || 'U')}
                        </span>
                        <span>{note.createdBy?.name || 'Admin'}</span>
                      </div>
                      <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>

      {/* Payment History Section (Moved outside the top grid) */}
      {lead.totalAmount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">Payment History & Timeline</h3>
            {lead.paymentStatus !== 'Paid' && (
              <button
                onClick={() => setShowPaymentForm(!showPaymentForm)}
                className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:bg-emerald-600 hover:shadow-emerald-500/40"
              >
                + Record New Payment
              </button>
            )}
          </div>

          {/* Add Payment Form */}
          {showPaymentForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={handleAddPayment}
              className="mb-8 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-6"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Amount (₹) *</label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      required
                      min="0.01"
                      step="0.01"
                      value={paymentData.amountPaid}
                      onChange={(e) => setPaymentData({ ...paymentData, amountPaid: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Method</label>
                  <select
                    value={paymentData.paymentMethod}
                    onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Transaction ID</label>
                  <input
                    type="text"
                    value={paymentData.transactionId}
                    onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Payment Note</label>
                  <input
                    type="text"
                    value={paymentData.note}
                    onChange={(e) => setPaymentData({ ...paymentData, note: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button type="button" onClick={() => setShowPaymentForm(false)} className="px-6 py-2.5 font-medium text-gray-500 hover:text-gray-700 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl bg-emerald-500 px-8 py-2.5 font-bold text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600">
                  Confirm Payment
                </button>
              </div>
            </motion.form>
          )}

          {/* Payment Timeline */}
          <div className="space-y-6">
            {(!lead.payments || lead.payments.length === 0) ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <FiDollarSign className="text-3xl" />
                </div>
                <p className="text-gray-500 font-medium">No payments recorded yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...lead.payments].reverse().map((payment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-emerald-200"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                        <FiDollarSign className="text-xl font-bold" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{new Date(payment.paymentDate).toLocaleDateString()}</span>
                    </div>
                    <h4 className="mb-1 text-2xl font-black text-emerald-600">{formatCurrency(payment.amountPaid)}</h4>
                    <div className="mb-4 flex gap-3 text-xs font-semibold text-gray-500">
                      <span className="rounded-full bg-gray-100 px-3 py-1">{payment.paymentMethod}</span>
                      {payment.transactionId && <span className="rounded-full bg-blue-50 text-blue-600 px-3 py-1">#{payment.transactionId}</span>}
                    </div>
                    {payment.note && (
                      <p className="mt-auto border-t pt-3 text-sm italic text-gray-600">"{payment.note}"</p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CustomerDetails;
