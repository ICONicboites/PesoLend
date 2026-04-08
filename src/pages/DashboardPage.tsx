import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, FileText, CheckCircle } from "lucide-react";
import { BottomNavigation } from "../components/BottomNavigation";

interface Loan {
  id: string;
  type: "Personal Loan" | "Emergency Fund";
  amount: number;
  status: "Approved" | "Pending";
}

const DashboardPage: React.FC = () => {
  const [userName] = useState("Juan Dela Cruz");
  const [availableCredit] = useState(25000);
  const [remainingCredit] = useState(3600);
  const [dueDate] = useState("Apr 15, 2025");

  const [activeLoanss] = useState<Loan[]>([
    { id: "1", type: "Personal Loan", amount: 3000, status: "Approved" },
    { id: "2", type: "Emergency Fund", amount: 2140, status: "Pending" },
  ]);

  const formatPeso = (amount: number) =>
    `₱ ${amount.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="min-h-screen bg-gray-900 pb-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 border-b border-gray-700 py-8"
      >
        <div className="container-max">
          <p className="text-orange-500 text-lg font-semibold mb-2">
            Congratulations
          </p>
          <h1 className="text-4xl font-bold text-white">{userName}</h1>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container-max py-8 space-y-8">
        {/* Available Credit Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-orange-500 rounded-xl p-8 text-white shadow-lg"
        >
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-orange-100 text-sm font-semibold mb-2">
                Available Credit
              </p>
              <h2 className="text-4xl font-bold">
                {formatPeso(availableCredit)}
              </h2>
            </div>
            <CreditCard size={40} className="opacity-80" />
          </div>

          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-orange-400">
            <div>
              <p className="text-orange-100 text-sm mb-1">Remaining</p>
              <p className="text-2xl font-bold">
                {formatPeso(remainingCredit)}
              </p>
            </div>
            <div>
              <p className="text-orange-100 text-sm mb-1">Due Date</p>
              <p className="text-2xl font-bold">{dueDate}</p>
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
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 h-16">
            <FileText size={20} />
            Apply for Loan
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 h-16">
            <CheckCircle size={20} />
            Pay Now
          </button>
        </motion.div>

        {/* Active Loans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Active Loans</h3>
            <button className="text-orange-500 text-sm font-semibold hover:text-orange-400 transition-colors">
              See all ({activeLoanss.length})
            </button>
          </div>

          <div className="space-y-3">
            {activeLoanss.map((loan) => (
              <motion.div
                key={loan.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:border-orange-500 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{loan.type}</p>
                    <p className="text-gray-400 text-sm">{loan.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">
                    {formatPeso(loan.amount)}
                  </p>
                  <p
                    className={`text-sm font-semibold ${loan.status === "Approved" ? "text-green-500" : "text-gray-400"}`}
                  >
                    {loan.status}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default DashboardPage;
