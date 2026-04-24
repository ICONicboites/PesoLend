import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  MessageSquare,
  Clock,
  LogOut,
  Wallet,
  Bell,
  TrendingDown,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  getAllSupportTickets,
  getPendingLoans,
  isAdmin,
  clearUser,
  getTotalSystemBalance,
  getAdminTotalDisbursed,
  getAdminTotalCollected,
  getAdminOutstandingDebt,
} from "../services/storage";
import { useStorageSync } from "../hooks/useStorageSync";
import { ActivityLog } from "../components/ActivityLog";

interface TicketSummary {
  open: number;
  inProgress: number;
  resolved: number;
}

export const AdminDashboard = () => {
  const navigate = useNavigate();

  // useStorageSync watches each key via storage events (cross-tab) + polling (same-tab)
  const {
    data: pendingLoans,
    newCount: newLoanCount,
    clearAlert,
  } = useStorageSync("pesolend_loans", getPendingLoans, 3000);

  const { data: allTickets } = useStorageSync(
    "pesolend_support_tickets",
    getAllSupportTickets,
    5000,
  );

  const { data: systemBalance } = useStorageSync(
    "pesolend_payment_methods",
    getTotalSystemBalance,
    5000,
  );

  const { data: totalDisbursed } = useStorageSync(
    "pesolend_transactions",
    getAdminTotalDisbursed,
    5000,
  );

  const { data: totalCollected } = useStorageSync(
    "pesolend_transactions",
    getAdminTotalCollected,
    5000,
  );

  const { data: outstandingDebt } = useStorageSync(
    "pesolend_transactions",
    getAdminOutstandingDebt,
    5000,
  );

  const ticketStats: TicketSummary = {
    open: allTickets.filter((t: { status: string }) => t.status === "Open")
      .length,
    inProgress: allTickets.filter(
      (t: { status: string }) => t.status === "In Progress",
    ).length,
    resolved: allTickets.filter(
      (t: { status: string }) => t.status === "Resolved",
    ).length,
  };

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogout = () => {
    clearUser();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 shadow-lg border-b-4 border-red-500"
      >
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage loans, support tickets, and balance transactions
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            <LogOut size={20} />
            Logout
          </motion.button>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          {/* Pending Loans */}
          <motion.div whileHover={{ scale: 1.05 }} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Pending Loans
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
                  {pendingLoans.length}
                </p>
              </div>
              <div className="relative w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <Clock
                  size={24}
                  className="text-yellow-600 dark:text-yellow-400"
                />
                <AnimatePresence>
                  {newLoanCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    >
                      {newLoanCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Open Tickets */}
          <motion.div whileHover={{ scale: 1.05 }} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Open Tickets
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
                  {ticketStats.open}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <MessageSquare
                  size={24}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>
            </div>
          </motion.div>

          {/* System Balance */}
          <motion.div whileHover={{ scale: 1.05 }} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  System Balance
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                  ₱
                  {systemBalance.toLocaleString("en-PH", {
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Wallet
                  size={24}
                  className="text-green-600 dark:text-green-400"
                />
              </div>
            </div>
          </motion.div>

          {/* Total Lent Out */}
          <motion.div whileHover={{ scale: 1.05 }} className="card border-l-4 border-red-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Total Lent Out
                </p>
                <p className="text-xl font-bold text-red-600 dark:text-red-400 mt-1">
                  ₱{totalDisbursed.toLocaleString("en-PH", { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Money disbursed to customers</p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <TrendingDown size={24} className="text-red-600 dark:text-red-400" />
              </div>
            </div>
          </motion.div>

          {/* Total Collected */}
          <motion.div whileHover={{ scale: 1.05 }} className="card border-l-4 border-green-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Total Collected
                </p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">
                  ₱{totalCollected.toLocaleString("en-PH", { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Payments received from customers</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <TrendingUp size={24} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>

          {/* Outstanding Debt */}
          <motion.div whileHover={{ scale: 1.05 }} className="card border-l-4 border-amber-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Outstanding Debt
                </p>
                <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                  ₱{outstandingDebt.toLocaleString("en-PH", { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total still owed by all customers</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center">
                <AlertCircle size={24} className="text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Loans Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <Clock
                  size={20}
                  className="text-yellow-600 dark:text-yellow-400"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Pending Loans ({pendingLoans.length})
              </h2>
            </div>

            <AnimatePresence>
              {newLoanCount > 0 && (
                <motion.div
                  key="new-alert"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-sm"
                >
                  <span className="flex items-center gap-2 text-red-700 dark:text-red-300 font-medium">
                    <Bell size={16} className="animate-bounce" />
                    {newLoanCount} new loan{newLoanCount !== 1 ? "s" : ""}{" "}
                    submitted
                  </span>
                  <button
                    onClick={clearAlert}
                    className="text-red-400 hover:text-red-600 dark:hover:text-red-200 text-xs underline"
                  >
                    Dismiss
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {pendingLoans.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <CheckCircle2
                  size={40}
                  className="mx-auto mb-3 text-green-400"
                />
                <p className="text-gray-500 dark:text-gray-400">
                  All loans have been reviewed!
                </p>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  clearAlert();
                  navigate("/admin/loans");
                }}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
              >
                Review {pendingLoans.length} Pending Loan
                {pendingLoans.length !== 1 ? "s" : ""}
              </motion.button>
            )}
          </motion.div>

          {/* Support Tickets Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <MessageSquare
                  size={20}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Support Tickets ({ticketStats.open + ticketStats.inProgress})
              </h2>
            </div>

            {ticketStats.open + ticketStats.inProgress === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <CheckCircle2
                  size={40}
                  className="mx-auto mb-3 text-green-400"
                />
                <p className="text-gray-500 dark:text-gray-400">
                  All tickets have been handled!
                </p>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/admin/support")}
                className="w-full py-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
              >
                Handle {ticketStats.open + ticketStats.inProgress} Ticket
                {ticketStats.open + ticketStats.inProgress !== 1 ? "s" : ""}
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 card"
        >
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Quick Access
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/admin/loans")}
              className="p-4 border-2 border-gray-200 dark:border-gray-700 hover:border-yellow-400 dark:hover:border-yellow-400 rounded-lg text-left transition-colors"
            >
              <div className="font-semibold text-gray-800 dark:text-white">
                Review Loans
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Approve or reject pending loan applications
              </p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/admin/support")}
              className="p-4 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-400 rounded-lg text-left transition-colors"
            >
              <div className="font-semibold text-gray-800 dark:text-white">
                Handle Tickets
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Reply to customer support inquiries
              </p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/admin/balance")}
              className="p-4 border-2 border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-400 rounded-lg text-left transition-colors"
            >
              <div className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <Wallet size={18} />
                Manage Balance
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Configure payment methods and approve transactions
              </p>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <ActivityLog limit={8} showHeader />
        </motion.div>
      </div>
    </div>
  );
};
