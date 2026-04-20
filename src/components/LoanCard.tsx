import { Loan, updateLoanStatus } from "../services/storage";
import { motion } from "framer-motion";
import { CheckCircle, Clock, XCircle } from "lucide-react";

interface LoanCardProps {
  loan: Loan;
  onStatusChange: () => void;
  index?: number;
}

export const LoanCard: React.FC<LoanCardProps> = ({
  loan,
  onStatusChange,
  index = 0,
}) => {
  const statusConfig = {
    Pending: {
      icon: Clock,
      bg: "bg-yellow-100 dark:bg-yellow-900",
      text: "text-yellow-800 dark:text-yellow-200",
      color: "text-yellow-500",
    },
    Approved: {
      icon: CheckCircle,
      bg: "bg-green-100 dark:bg-green-900",
      text: "text-green-800 dark:text-green-200",
      color: "text-green-500",
    },
    Rejected: {
      icon: XCircle,
      bg: "bg-red-100 dark:bg-red-900",
      text: "text-red-800 dark:text-red-200",
      color: "text-red-500",
    },
  };

  const config = statusConfig[loan.status];
  const StatusIcon = config.icon;

  const handleStatusChange = (newStatus: "Approved" | "Rejected") => {
    updateLoanStatus(loan.id, newStatus);
    onStatusChange();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card hover:shadow-xl"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            ₱{loan.amount.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {loan.duration} months
          </p>
        </div>
        <div className={`${config.bg} ${config.text} rounded-full p-3`}>
          <StatusIcon size={24} className={config.color} />
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Loan ID: {loan.id}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Applied: {new Date(loan.date).toLocaleDateString()}
      </p>

      {loan.status === "Pending" && (
        <div className="flex gap-2 mt-4 pt-4 border-t dark:border-gray-700">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleStatusChange("Approved")}
            className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            Approve
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleStatusChange("Rejected")}
            className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            Reject
          </motion.button>
        </div>
      )}

      <div
        className={`mt-3 px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text} inline-block`}
      >
        {loan.status}
      </div>
    </motion.div>
  );
};
