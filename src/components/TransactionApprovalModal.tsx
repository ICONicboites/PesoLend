import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Transaction, updateTransactionStatus, getPaymentMethodById, getUser, getRegisteredUsers } from '../services/storage';

interface TransactionApprovalModalProps {
  isOpen: boolean;
  transaction?: Transaction;
  onClose: () => void;
  onApprove: (transactionId: string, paymentMethodId: string) => void;
  onReject: (transactionId: string, paymentMethodId: string) => void;
}

export const TransactionApprovalModal = ({
  isOpen,
  transaction,
  onClose,
  onApprove,
  onReject,
}: TransactionApprovalModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !transaction) return null;

  const paymentMethod = transaction.paymentMethodId
    ? getPaymentMethodById(transaction.paymentMethodId)
    : null;

  const users = getRegisteredUsers();
  const user = users.find(u => u.id === transaction.userId);
  const isAdmin = transaction.userId === 'admin-001';

  const formatBalance = (amount: number) => {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleApprove = async () => {
    setError('');
    setIsProcessing(true);

    try {
      if (!paymentMethod) {
        setError('Payment method not found');
        return;
      }

      // Check if sufficient balance exists for withdrawals
      if (
        (transaction.type === 'Withdrawal' || transaction.type === 'Disbursement') &&
        paymentMethod.available_balance < transaction.amount
      ) {
        setError('Insufficient balance in this payment method');
        return;
      }

      onApprove(transaction.id, transaction.paymentMethodId || '');
      setIsProcessing(false);
      onClose();
    } catch (err) {
      setError('Error approving transaction');
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setError('');
    setIsProcessing(true);

    try {
      onReject(transaction.id, transaction.paymentMethodId || '');
      setIsProcessing(false);
      onClose();
    } catch (err) {
      setError('Error rejecting transaction');
      setIsProcessing(false);
    }
  };

  const isPending = transaction.status === 'Pending';
  const isDeposit = transaction.type === 'Deposit' || transaction.type === 'Payment';
  const typeColor = isDeposit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  const bgColor = isDeposit ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Transaction Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Status Badge */}
        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            transaction.status === 'Pending'
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
              : transaction.status === 'Approved'
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          }`}>
            {transaction.status}
          </div>
        </div>

        {/* Transaction Info */}
        <div className="space-y-4 mb-6">
          {/* Type & Amount */}
          <div className={`p-3 rounded-lg ${bgColor}`}>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Transaction Type
            </p>
            <p className={`text-2xl font-bold ${typeColor}`}>
              {transaction.type === 'Deposit' || transaction.type === 'Payment' ? '+' : '-'}
              {formatBalance(transaction.amount)}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {transaction.type}
            </p>
          </div>

          {/* User Info */}
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Customer</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">
              {isAdmin ? 'Admin Account' : user?.name || 'Unknown User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isAdmin ? 'admin@pesolend.com' : user?.email}
            </p>
          </div>

          {/* Payment Method */}
          {paymentMethod && (
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Payment Method</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">
                {paymentMethod.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Current Balance: {formatBalance(paymentMethod.available_balance)}
              </p>
            </div>
          )}

          {/* Description */}
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Description</p>
            <p className="text-sm text-gray-800 dark:text-gray-200">
              {transaction.description}
            </p>
          </div>

          {/* Date & ID */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Date</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">
                {new Date(transaction.date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Transaction ID</p>
              <p className="text-xs font-mono text-gray-600 dark:text-gray-400">
                {transaction.id.slice(0, 8)}...
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Balance Check Warning */}
        {isPending &&
          (transaction.type === 'Withdrawal' || transaction.type === 'Disbursement') &&
          paymentMethod &&
          paymentMethod.available_balance < transaction.amount && (
          <div className="mb-4 p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-700 dark:text-orange-400 text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            Insufficient balance for this withdrawal
          </div>
        )}

        {/* Actions */}
        {isPending && (
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReject}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <X size={18} />
              Reject
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleApprove}
              disabled={
                isProcessing ||
                ((transaction.type === 'Withdrawal' || transaction.type === 'Disbursement') &&
                  paymentMethod &&
                  paymentMethod.available_balance < transaction.amount)
              }
              className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={18} />
              Approve
            </motion.button>
          </div>
        )}

        {!isPending && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors"
          >
            Close
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};
