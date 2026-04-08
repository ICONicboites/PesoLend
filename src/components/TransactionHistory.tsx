import { getTransactions } from "../services/storage";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export const TransactionHistory: React.FC = () => {
  const transactions = getTransactions();

  const mockTransactions = [
    {
      id: "1",
      type: "Disbursement" as const,
      amount: 50000,
      date: "2024-01-15",
      description: "Loan Disbursement",
    },
    {
      id: "2",
      type: "Payment" as const,
      amount: 5000,
      date: "2024-01-20",
      description: "Monthly Payment",
    },
    {
      id: "3",
      type: "Payment" as const,
      amount: 5000,
      date: "2024-02-20",
      description: "Monthly Payment",
    },
  ];

  const allTransactions = [...transactions, ...mockTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card"
    >
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
        Transaction History
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                Type
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                Amount
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                Description
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {allTransactions.slice(0, 10).map((transaction, index) => (
              <motion.tr
                key={transaction.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.type === "Disbursement"
                          ? "bg-green-100 dark:bg-green-900"
                          : "bg-blue-100 dark:bg-blue-900"
                      }`}
                    >
                      {transaction.type === "Disbursement" ? (
                        <ArrowDownRight size={18} className="text-green-600" />
                      ) : (
                        <ArrowUpRight size={18} className="text-blue-600" />
                      )}
                    </div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {transaction.type}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="font-bold text-gray-800 dark:text-white">
                    ₱{transaction.amount.toLocaleString()}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                  {transaction.description}
                </td>
                <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-sm">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
