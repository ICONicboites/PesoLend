import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, FileText, CheckCircle, X } from "lucide-react";
import { BottomNavigation } from "../components/BottomNavigation";
import { LoanApplicationModal } from "../components/LoanApplicationModal";
import { PaymentModal } from "../components/PaymentModal";
import { LoanCard } from "../components/LoanCard";
import { ActivityLog } from "../components/ActivityLog";
import {
  getUser,
  getActiveLoans,
  getAvailableCredit,
  getTotalPayments,
  getOutstandingBalance,
  isAdmin,
} from "../services/storage";
import { useStorageSync } from "../hooks/useStorageSync";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [loanModalOpen, setLoanModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [dueDatesModalOpen, setDueDatesModalOpen] = useState(false);

  // Live-synced: updates when Admin approves/rejects loans or transactions change
  const { data: activeLoans } = useStorageSync("pesolend_loans", getActiveLoans, 3000);
  const { data: availableCredit } = useStorageSync("pesolend_transactions", getAvailableCredit, 3000);
  const { data: totalPayments } = useStorageSync("pesolend_transactions", getTotalPayments, 3000);
  const { data: outstandingBalance } = useStorageSync("pesolend_transactions", getOutstandingBalance, 3000);

  const userName = user?.name ?? "";

  useEffect(() => {
    if (isAdmin()) {
      navigate("/admin");
    }
  }, [navigate]);

  const formatPeso = (amount: number) =>
    `₱ ${amount.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const getLoanDueDate = (appliedDate: string, durationMonths: number) => {
    const due = new Date(appliedDate);
    due.setMonth(due.getMonth() + durationMonths);
    return due;
  };

  const sortedDueLoans = [...activeLoans].sort((a, b) => {
    const aDue = getLoanDueDate(a.date, a.duration).getTime();
    const bDue = getLoanDueDate(b.date, b.duration).getTime();
    return aDue - bDue;
  });

  const nearestDueDate = sortedDueLoans[0]
    ? getLoanDueDate(sortedDueLoans[0].date, sortedDueLoans[0].duration)
    : null;

  const nearestDueDateStr = nearestDueDate
    ? nearestDueDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "No active due date";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-32 transition-colors duration-200">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-8"
      >
        <div className="container-max">
          <p className="text-amber-500 text-lg font-semibold mb-2">
            Congratulations
          </p>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {userName}
          </h1>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container-max py-8 space-y-8">
        {/* Available Credit Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-amber-500 rounded-xl p-8 text-white shadow-lg"
        >
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-amber-100 text-sm font-semibold mb-2">
                Available Credit
              </p>
              <h2 className="text-4xl font-bold">
                {formatPeso(availableCredit)}
              </h2>
            </div>
            <CreditCard size={40} className="opacity-80" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-amber-400">
            <div>
              <p className="text-amber-100 text-sm mb-1">Remaining Balance</p>
              <p className="text-2xl font-bold">
                {formatPeso(outstandingBalance)}
              </p>
            </div>
            <div>
              <p className="text-amber-100 text-sm mb-1">Total Paid</p>
              <p className="text-2xl font-bold">
                {formatPeso(totalPayments)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDueDatesModalOpen(true)}
              className="text-left rounded-lg p-2 -m-2 md:col-span-2 hover:bg-amber-400/30 transition-colors"
            >
              <p className="text-amber-100 text-sm mb-1">Due Date</p>
              <p className="text-2xl font-bold">{nearestDueDateStr}</p>
              <p className="text-amber-100 text-xs mt-1 underline">Tap to view all due loans</p>
            </button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setLoanModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 h-16"
          >
            <FileText size={20} />
            Apply for Loan
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPaymentModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 h-16"
          >
            <CheckCircle size={20} />
            Pay Now
          </motion.button>
        </motion.div>

        {/* Active Loans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Active Loans
            </h3>
            <button className="text-amber-500 text-sm font-semibold hover:text-amber-400 transition-colors">
              See all ({activeLoans.length})
            </button>
          </div>

          {activeLoans.length > 0 ? (
            <div className="space-y-3">
              {activeLoans.map((loan) => (
                <LoanCard
                  key={loan.id}
                  loan={loan}
                  onStatusChange={() => {}}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center"
            >
              <CreditCard size={40} className="mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                No active loans yet
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
                Apply for a loan to get started
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLoanModalOpen(true)}
                className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors"
              >
                Apply for Loan
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Activity Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <ActivityLog limit={5} />
        </motion.div>
      </div>

      {/* Modals */}
      <LoanApplicationModal
        isOpen={loanModalOpen}
        onClose={() => setLoanModalOpen(false)}
        onSubmit={() => {
          setLoanModalOpen(false);
        }}
      />
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSuccess={() => {}}
      />

      {dueDatesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setDueDatesModalOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">All Due-Date Loans</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Loans with their expected due dates</p>
              </div>
              <button
                type="button"
                onClick={() => setDueDatesModalOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              {sortedDueLoans.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-600 dark:text-gray-400 font-medium">No active loans with due dates yet.</p>
                </div>
              ) : (
                sortedDueLoans.map((loan) => {
                  const dueDate = getLoanDueDate(loan.date, loan.duration);
                  return (
                    <div
                      key={loan.id}
                      className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/40"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-gray-900 dark:text-white">{formatPeso(loan.amount)}</p>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                          {loan.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <p className="text-gray-600 dark:text-gray-400">Loan ID</p>
                        <p className="text-gray-900 dark:text-white font-medium text-right">{loan.id}</p>
                        <p className="text-gray-600 dark:text-gray-400">Duration</p>
                        <p className="text-gray-900 dark:text-white font-medium text-right">{loan.duration} months</p>
                        <p className="text-gray-600 dark:text-gray-400">Applied</p>
                        <p className="text-gray-900 dark:text-white font-medium text-right">
                          {new Date(loan.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">Due Date</p>
                        <p className="text-amber-600 dark:text-amber-400 font-bold text-right">
                          {dueDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default DashboardPage;
