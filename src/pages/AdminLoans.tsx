import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { getPendingLoans, updateLoanStatus, isAdmin, Loan, getRegisteredUsers } from "../services/storage";

export const AdminLoans = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [userMap, setUserMap] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/dashboard");
      return;
    }

    const pendingLoans = getPendingLoans();
    setLoans(pendingLoans);

    // Create user map for quick lookup
    const users = getRegisteredUsers();
    const map: { [key: string]: any } = {};
    users.forEach(user => {
      map[user.id] = user;
    });
    setUserMap(map);
  }, [navigate]);

  const handleApprove = (loanId: string) => {
    const loan = loans.find(l => l.id === loanId);
    updateLoanStatus(loanId, 'Approved', loan?.paymentMethodId);
    setLoans(loans.filter(l => l.id !== loanId));
  };

  const handleReject = (loanId: string) => {
    const loan = loans.find(l => l.id === loanId);
    updateLoanStatus(loanId, 'Rejected', loan?.paymentMethodId);
    setLoans(loans.filter(l => l.id !== loanId));
  };

  const getUserName = (userId: string) => {
    return userMap[userId]?.name || 'Unknown User';
  };

  const getUserEmail = (userId: string) => {
    return userMap[userId]?.email || 'N/A';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/admin")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-700 dark:text-gray-300" />
          </motion.button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Review Loan Applications ({loans.length})
          </h1>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {loans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card text-center py-16"
          >
            <CheckCircle2 size={48} className="mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              No Pending Loans
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              All loan applications have been reviewed!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/admin")}
              className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Back to Dashboard
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {loans.map((loan, index) => (
              <motion.div
                key={loan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Loan Details */}
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
                        Applicant Information
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Name:</span>
                          <span className="font-semibold text-gray-800 dark:text-white">
                            {getUserName(loan.userId)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Email:</span>
                          <span className="font-semibold text-gray-800 dark:text-white">
                            {getUserEmail(loan.userId)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">User ID:</span>
                          <span className="font-mono text-sm text-gray-500 dark:text-gray-500">
                            {loan.userId}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
                        Loan Details
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Loan ID:</span>
                          <span className="font-mono text-sm text-gray-500 dark:text-gray-500">
                            {loan.id}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            ₱{loan.amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                          <span className="font-semibold text-gray-800 dark:text-white">
                            {loan.duration} months
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Applied On:</span>
                          <span className="text-gray-800 dark:text-white">
                            {new Date(loan.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description and Actions */}
                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
                        Description
                      </h3>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-gray-700 dark:text-gray-300">
                          {loan.description || "No description provided"}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApprove(loan.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                      >
                        <CheckCircle2 size={20} />
                        Approve
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleReject(loan.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                      >
                        <XCircle size={20} />
                        Reject
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
