import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { TransactionHistory } from "../components/TransactionHistory";
import { BottomNavigation } from "../components/BottomNavigation";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { getUser, getTransactions } from "../services/storage";
import { useStorageSync } from "../hooks/useStorageSync";

const TransactionsPage: React.FC = () => {
  const user = getUser();
  const [filterType, setFilterType] = useState<
    "All" | "Disbursement" | "Payment"
  >("All");

  // Live-synced: auto-updates when new transactions are recorded
  const { data: transactions } = useStorageSync("pesolend_transactions", getTransactions, 3000);
  const totalTransactions = transactions.length;
  const totalDisbursedAmount = transactions
    .filter((t) => t.type === "Disbursement")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalPaidAmount = transactions
    .filter((t) => t.type === "Payment")
    .reduce((sum, t) => sum + t.amount, 0);
  const outstandingBalance = Math.max(0, totalDisbursedAmount - totalPaidAmount);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32">
      <Navbar userName={user?.name} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Transaction History
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                View all your transactions and payments
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Download size={20} />
              Export
            </motion.button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {(["All", "Disbursement", "Payment"] as const).map((type) => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filterType === type
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {type}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TransactionHistory filterType={filterType} />
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8"
        >
          <div className="card">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
              Total Transactions
            </p>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
              {totalTransactions}
            </h3>
          </div>
          <div className="card">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
              Total Disbursed
            </p>
            <h3 className="text-3xl font-bold text-green-600">
              ₱{totalDisbursedAmount.toLocaleString()}
            </h3>
          </div>
          <div className="card">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
              Total Paid
            </p>
            <h3 className="text-3xl font-bold text-blue-600">
              ₱{totalPaidAmount.toLocaleString()}
            </h3>
          </div>
          <div className="card">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
              Remaining Balance
            </p>
            <h3 className="text-3xl font-bold text-amber-600">
              ₱{outstandingBalance.toLocaleString()}
            </h3>
          </div>
        </motion.div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default TransactionsPage;
