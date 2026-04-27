import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react";
import {
  isAdmin,
  getPaymentMethods,
  getTotalSystemBalance,
  getAllTransactions,
  getAllLoans,
  Transaction,
  PaymentMethod,
  updateTransactionStatus,
  getPaymentMethodTransactions,
  getRegisteredUsers,
} from "../services/storage";
import { PaymentMethodCard } from "../components/PaymentMethodCard";
import { TransactionApprovalModal } from "../components/TransactionApprovalModal";

interface FilterState {
  paymentMethodId: string;
  status: "All" | "Pending" | "Approved" | "Rejected";
  type: "All" | "Deposit" | "Withdrawal";
  startDate: string;
  endDate: string;
}

export const BalanceManagement = () => {
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    paymentMethodId: "",
    status: "All",
    type: "All",
    startDate: "",
    endDate: "",
  });
  useEffect(() => {
    if (!isAdmin()) {
      navigate("/dashboard");
      return;
    }

    const methods = getPaymentMethods();
    setPaymentMethods(methods);
    setAllTransactions(getAllTransactions());
    if (methods.length > 0) {
      setSelectedMethod(methods[0].id);
      setFilters((prev) => ({
        ...prev,
        paymentMethodId: methods[0].id,
      }));
    }
  }, [navigate]);

  const filteredTransactions = allTransactions
    .filter((t) => {
      if (
        filters.paymentMethodId &&
        t.paymentMethodId !== filters.paymentMethodId
      )
        return false;
      if (filters.status !== "All" && t.status !== filters.status) return false;
      if (filters.type !== "All" && t.type !== filters.type) return false;
      if (filters.startDate && t.date < filters.startDate) return false;
      if (filters.endDate && t.date > filters.endDate) return false;
      return true;
    })
    .sort((a, b) => Number(b.id) - Number(a.id));

  const selectedPaymentMethod = paymentMethods.find(
    (m) => m.id === selectedMethod,
  );
  const totalBalance = getTotalSystemBalance();
  const pendingTransactions = filteredTransactions.filter(
    (t) => t.status === "Pending",
  );
  const approvedTransactions = filteredTransactions.filter(
    (t) => t.status === "Approved",
  );
  const rejectedTransactions = filteredTransactions.filter(
    (t) => t.status === "Rejected",
  );

  const handleApproveTransaction = (
    transactionId: string,
    paymentMethodId: string,
  ) => {
    const success = updateTransactionStatus(
      transactionId,
      "Approved",
      paymentMethodId,
    );
    if (success) {
      setAllTransactions(getAllTransactions());
      setPaymentMethods(getPaymentMethods());
      setSelectedTransaction(null);
    }
  };

  const handleRejectTransaction = (
    transactionId: string,
    paymentMethodId: string,
  ) => {
    const success = updateTransactionStatus(
      transactionId,
      "Rejected",
      paymentMethodId,
    );
    if (success) {
      setAllTransactions(getAllTransactions());
      setPaymentMethods(getPaymentMethods());
      setSelectedTransaction(null);
    }
  };

  const formatBalance = (amount: number) => {
    return `₱${amount.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const users = getRegisteredUsers();
  const allLoans = getAllLoans();
  const getUserName = (transaction: Transaction) => {
    const { userId, loanId } = transaction;
    if (userId === "admin-001") return "Admin";
    const user = users.find((u) => u.id === userId);
    if (user) return user.name;
    // Fallback: resolve via the loan's borrower
    if (loanId) {
      const loan = allLoans.find((l) => l.id === loanId);
      if (loan) {
        const borrower = users.find((u) => u.id === loan.userId);
        if (borrower) return borrower.name;
      }
    }
    return "Unknown";
  };

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
              onClick={() => navigate("/admin")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft
                size={24}
                className="text-gray-600 dark:text-gray-400"
              />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Balance Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage payment methods and customer transactions
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* System Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          {/* Total System Balance */}
          <motion.div whileHover={{ scale: 1.05 }} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Total System Balance
                </p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {formatBalance(totalBalance)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <DollarSign
                  size={24}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>
            </div>
          </motion.div>

          {/* Pending Transactions */}
          <motion.div whileHover={{ scale: 1.05 }} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Pending Transactions
                </p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                  {pendingTransactions.length}
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  {formatBalance(
                    pendingTransactions.reduce((sum, t) => sum + t.amount, 0),
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <AlertCircle
                  size={24}
                  className="text-yellow-600 dark:text-yellow-400"
                />
              </div>
            </div>
          </motion.div>

          {/* Approved Transactions */}
          <motion.div whileHover={{ scale: 1.05 }} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Approved
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {approvedTransactions.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <TrendingUp
                  size={24}
                  className="text-green-600 dark:text-green-400"
                />
              </div>
            </div>
          </motion.div>

          {/* Rejected Transactions */}
          <motion.div whileHover={{ scale: 1.05 }} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Rejected
                </p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">
                  {rejectedTransactions.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <TrendingDown
                  size={24}
                  className="text-red-600 dark:text-red-400"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Payment Methods Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Payment Methods
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paymentMethods.map((method) => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                isSelected={selectedMethod === method.id}
                onClick={() => {
                  setSelectedMethod(method.id);
                  setFilters((prev) => ({
                    ...prev,
                    paymentMethodId: method.id,
                  }));
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Transactions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Transactions{" "}
              {selectedPaymentMethod && `- ${selectedPaymentMethod.name}`}
            </h2>
          </div>

          {/* Transactions Table */}
          <div className="card overflow-x-auto">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">
                  No transactions found
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Description
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <motion.tr
                      key={transaction.id}
                      whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {transaction.userId === "admin-001" ? (
                          <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                            Admin
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                            Customer
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex items-center gap-1 ${
                            transaction.type === "Deposit" ||
                            transaction.type === "Payment"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {transaction.type === "Deposit" ||
                          transaction.type === "Payment" ? (
                            <TrendingUp size={14} />
                          ) : (
                            <TrendingDown size={14} />
                          )}
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {transaction.description}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-gray-800 dark:text-white">
                        {transaction.type === "Deposit" ||
                        transaction.type === "Payment"
                          ? "+"
                          : "-"}
                        {formatBalance(transaction.amount)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            transaction.status === "Pending"
                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                              : transaction.status === "Approved"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setIsApprovalModalOpen(true);
                          }}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium transition-colors text-xs"
                        >
                          View
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>

      {/* Transaction Approval Modal */}
      <TransactionApprovalModal
        isOpen={isApprovalModalOpen}
        transaction={selectedTransaction || undefined}
        onClose={() => {
          setIsApprovalModalOpen(false);
          setSelectedTransaction(null);
        }}
        onApprove={handleApproveTransaction}
        onReject={handleRejectTransaction}
      />
    </div>
  );
};
