import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, MessageSquare, Clock, LogOut } from "lucide-react";
import { getAllSupportTickets, getPendingLoans, isAdmin, clearUser, Loan } from "../services/storage";

interface TicketSummary {
  open: number;
  inProgress: number;
  resolved: number;
}

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pendingLoans, setPendingLoans] = useState<Loan[]>([]);
  const [ticketStats, setTicketStats] = useState<TicketSummary>({
    open: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/dashboard");
      return;
    }

    const loans = getPendingLoans();
    setPendingLoans(loans);

    const tickets = getAllSupportTickets();
    setTicketStats({
      open: tickets.filter(t => t.status === 'Open').length,
      inProgress: tickets.filter(t => t.status === 'In Progress').length,
      resolved: tickets.filter(t => t.status === 'Resolved').length,
    });
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
              Manage loans and support tickets
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
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Pending Loans</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
                  {pendingLoans.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <Clock size={24} className="text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </motion.div>

          {/* Open Tickets */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Open Tickets</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
                  {ticketStats.open}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <MessageSquare size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>

          {/* In Progress Tickets */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">In Progress</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
                  {ticketStats.inProgress}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <Clock size={24} className="text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </motion.div>

          {/* Resolved Tickets */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Resolved</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
                  {ticketStats.resolved}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <CheckCircle2 size={24} className="text-green-600 dark:text-green-400" />
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
                <Clock size={20} className="text-yellow-600 dark:text-yellow-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Pending Loans ({pendingLoans.length})
              </h2>
            </div>

            {pendingLoans.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <CheckCircle2 size={40} className="mx-auto mb-3 text-green-400" />
                <p className="text-gray-500 dark:text-gray-400">
                  All loans have been reviewed!
                </p>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/admin/loans")}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg font-bold hover:shadow-lg transition-all"
              >
                Review {pendingLoans.length} Pending Loan{pendingLoans.length !== 1 ? 's' : ''}
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
                <MessageSquare size={20} className="text-blue-600 dark:text-blue-400" />
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
                <CheckCircle2 size={40} className="mx-auto mb-3 text-green-400" />
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
                Handle {ticketStats.open + ticketStats.inProgress} Ticket{ticketStats.open + ticketStats.inProgress !== 1 ? 's' : ''}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </motion.div>
      </div>
    </div>
  );
};
