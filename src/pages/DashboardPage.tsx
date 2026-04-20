import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, FileText, CheckCircle } from "lucide-react";
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
  isAdmin,
  Loan,
} from "../services/storage";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [userName, setUserName] = useState("");
  const [activeLoans, setActiveLoans] = useState<Loan[]>([]);
  const [availableCredit, setAvailableCredit] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [loanModalOpen, setLoanModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Redirect admin users to admin dashboard
    if (isAdmin()) {
      navigate("/admin");
      return;
    }

    if (user) {
      setUserName(user.name);
    }
    // Fetch real data from storage
    const loans = getActiveLoans();
    setActiveLoans(loans);
    setAvailableCredit(getAvailableCredit());
    setTotalPayments(getTotalPayments());
  }, [user, refreshTrigger, navigate]);

  const formatPeso = (amount: number) =>
    `₱ ${amount.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 15);
  const dueDateStr = dueDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

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

          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-amber-400">
            <div>
              <p className="text-amber-100 text-sm mb-1">Total Paid</p>
              <p className="text-2xl font-bold">
                {formatPeso(totalPayments)}
              </p>
            </div>
            <div>
              <p className="text-amber-100 text-sm mb-1">Due Date</p>
              <p className="text-2xl font-bold">{dueDateStr}</p>
            </div>
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
                  onStatusChange={() => setRefreshTrigger(prev => prev + 1)}
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
          setRefreshTrigger(prev => prev + 1);
        }}
      />
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSuccess={() => {
          setRefreshTrigger(prev => prev + 1);
        }}
      />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default DashboardPage;
