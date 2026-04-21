import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, Download } from 'lucide-react';
import {
  isAdmin,
  getAllBalanceTransactions,
  BalanceTransaction,
  getPaymentMethodById,
  getRegisteredUsers,
} from '../services/storage';

export const TransactionAuditLog = () => {
  const navigate = useNavigate();
  const [balanceTransactions, setBalanceTransactions] = useState<BalanceTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<BalanceTransaction[]>([]);
  const [filterType, setFilterType] = useState<'All' | 'Deposit' | 'Withdrawal'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Approved' | 'Rejected'>('All');
  const [searchPaymentMethod, setSearchPaymentMethod] = useState('');

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/dashboard');
      return;
    }

    const transactions = getAllBalanceTransactions();
    setBalanceTransactions(transactions);
    applyFilters(transactions);
  }, [navigate]);

  const applyFilters = (transactions: BalanceTransaction[]) => {
    let filtered = transactions;

    if (filterType !== 'All') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    if (filterStatus !== 'All') {
      filtered = filtered.filter(t => t.status === filterStatus);
    }

    if (searchPaymentMethod) {
      const method = getPaymentMethodById(searchPaymentMethod);
      if (method) {
        filtered = filtered.filter(t => t.paymentMethodId === searchPaymentMethod);
      }
    }

    // Sort by timestamp descending
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setFilteredTransactions(filtered);
  };

  useEffect(() => {
    applyFilters(balanceTransactions);
  }, [filterType, filterStatus, searchPaymentMethod]);

  const formatBalance = (amount: number) => {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const exportToCSV = () => {
    const csv = [
      ['Timestamp', 'Payment Method', 'Type', 'Amount', 'Status', 'Previous Balance', 'New Balance', 'Description'],
      ...filteredTransactions.map(t => {
        const method = getPaymentMethodById(t.paymentMethodId);
        return [
          formatDateTime(t.timestamp),
          method?.name || 'Unknown',
          t.type,
          t.amount,
          t.status,
          t.previousBalance,
          t.newBalance,
          t.description,
        ];
      }),
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalDepositsAmount = filteredTransactions
    .filter(t => t.type === 'Deposit' && t.status === 'Approved')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawalsAmount = filteredTransactions
    .filter(t => t.type === 'Withdrawal' && t.status === 'Approved')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 shadow-lg border-b-4 border-red-500"
      >
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Transaction Audit Log
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Complete record of all balance transactions
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            <Download size={18} />
            Export CSV
          </motion.button>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          {/* Total Transactions */}
          <motion.div whileHover={{ scale: 1.05 }} className="card">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Transactions</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              {filteredTransactions.length}
            </p>
          </motion.div>

          {/* Total Deposits */}
          <motion.div whileHover={{ scale: 1.05 }} className="card">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Deposits</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
              {formatBalance(totalDepositsAmount)}
            </p>
          </motion.div>

          {/* Total Withdrawals */}
          <motion.div whileHover={{ scale: 1.05 }} className="card">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Withdrawals</p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
              {formatBalance(totalWithdrawalsAmount)}
            </p>
          </motion.div>

          {/* Net Change */}
          <motion.div whileHover={{ scale: 1.05 }} className="card">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Net Change</p>
            <p className={`text-3xl font-bold mt-2 ${
              totalDepositsAmount - totalWithdrawalsAmount >= 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              {formatBalance(totalDepositsAmount - totalWithdrawalsAmount)}
            </p>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-8"
        >
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Transaction Type
              </label>
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                <option>All</option>
                <option>Deposit</option>
                <option>Withdrawal</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                <option>All</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>

            {/* Payment Method Filter would go here if needed */}
            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setFilterType('All');
                  setFilterStatus('All');
                  setSearchPaymentMethod('');
                }}
                className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-lg font-medium transition-colors"
              >
                Reset Filters
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Audit Log Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card overflow-x-auto"
        >
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">No transactions found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Timestamp
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Payment Method
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Type
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Previous
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                    New
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(transaction => {
                  const method = getPaymentMethodById(transaction.paymentMethodId);
                  const balanceChange = transaction.newBalance - transaction.previousBalance;

                  return (
                    <motion.tr
                      key={transaction.id}
                      whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {formatDateTime(transaction.timestamp)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-white">
                        {method?.name || 'Unknown'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center gap-1 ${
                          transaction.type === 'Deposit'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.type === 'Deposit' ? (
                            <TrendingUp size={14} />
                          ) : (
                            <TrendingDown size={14} />
                          )}
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-gray-800 dark:text-white">
                        {formatBalance(transaction.amount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-400">
                        {formatBalance(transaction.previousBalance)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold">
                        <span className={balanceChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          {formatBalance(transaction.newBalance)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          transaction.status === 'Approved'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </motion.div>

        {/* Detailed View - Recent Transactions */}
        {filteredTransactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Transaction Timeline
            </h2>
            <div className="space-y-4">
              {filteredTransactions.slice(0, 10).map((transaction, index) => {
                const method = getPaymentMethodById(transaction.paymentMethodId);
                const balanceChange = transaction.newBalance - transaction.previousBalance;

                return (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${
                        transaction.type === 'Deposit'
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : 'bg-red-100 dark:bg-red-900/30'
                      }`}>
                        {transaction.type === 'Deposit' ? (
                          <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
                        ) : (
                          <TrendingDown className="text-red-600 dark:text-red-400" size={20} />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {transaction.type} - {method?.name || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDateTime(transaction.timestamp)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {transaction.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${
                        balanceChange >= 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {balanceChange >= 0 ? '+' : '-'}
                        {formatBalance(Math.abs(balanceChange))}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {formatBalance(transaction.previousBalance)} → {formatBalance(transaction.newBalance)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
