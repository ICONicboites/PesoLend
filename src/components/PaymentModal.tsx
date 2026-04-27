import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, CreditCard, Wallet, Building2 } from "lucide-react";
import {
  processPayment,
  getLoansList,
  getLoanRemainingBalance,
} from "../services/storage";
import { useStorageSync } from "../hooks/useStorageSync";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    amount: "",
    loanId: "",
    paymentMethod: "pm-gcash",
    description: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Live-sync approved loans so new loans appear immediately
  const { data: approvedLoans } = useStorageSync(
    "pesolend_loans",
    () =>
      getLoansList().filter(
        (l) => l.status === "Approved" && getLoanRemainingBalance(l.id) > 0,
      ),
    3000,
  );

  const hasPayableLoans = approvedLoans.length > 0;

  useEffect(() => {
    if (isOpen) {
      setFormData({
        amount: "",
        loanId: approvedLoans.length > 0 ? approvedLoans[0].id : "",
        paymentMethod: "pm-gcash",
        description: "",
      });
      setError("");
      setSuccess(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    setFormData((prev) => {
      const selectedLoanStillExists = approvedLoans.some(
        (loan) => loan.id === prev.loanId,
      );

      if (selectedLoanStillExists) {
        return prev;
      }

      return {
        ...prev,
        loanId: approvedLoans.length > 0 ? approvedLoans[0].id : "",
      };
    });
  }, [approvedLoans, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!formData.amount) {
      setError("Please enter a payment amount");
      setLoading(false);
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      setError("Payment amount must be greater than 0");
      setLoading(false);
      return;
    }

    if (!formData.loanId) {
      setError("Please select a loan");
      setLoading(false);
      return;
    }

    if (!hasPayableLoans) {
      setError("No unpaid approved loans available");
      setLoading(false);
      return;
    }

    if (!formData.paymentMethod) {
      setError("Please select a payment method");
      setLoading(false);
      return;
    }

    // Get payment method label
    const paymentMethodLabels: { [key: string]: string } = {
      "pm-gcash": "GCash",
      "pm-bank": "Bank Transfer",
      "pm-paypal": "PayPal",
    };

    try {
      // Process payment
      const success = processPayment(
        amount,
        formData.loanId,
        formData.paymentMethod,
        formData.description || "Monthly payment",
      );

      if (success) {
        setSuccess(true);
        setFormData({
          amount: "",
          loanId: approvedLoans.length > 0 ? approvedLoans[0].id : "",
          paymentMethod: "pm-gcash",
          description: "",
        });
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        setError("Payment processing failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while processing payment");
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const paymentMethods = [
    { id: "pm-gcash", label: "GCash", icon: Wallet },
    { id: "pm-bank", label: "Bank Transfer", icon: Building2 },
    { id: "pm-paypal", label: "PayPal", icon: Wallet },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="card max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Make Payment
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
          >
            <X
              size={24}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            />
          </motion.button>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Payment Successful!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your payment has been processed successfully.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Loan Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Loan *
              </label>
              <select
                name="loanId"
                value={formData.loanId}
                onChange={handleChange}
                disabled={!hasPayableLoans}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="">Choose a loan</option>
                {approvedLoans.map((loan) => (
                  <option key={loan.id} value={loan.id}>
                    {loan.description} - ₱{loan.amount.toLocaleString()} (
                    {loan.duration}mo)
                  </option>
                ))}
              </select>
              {!hasPayableLoans && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  You have no unpaid approved loans.
                </p>
              )}
            </div>

            {/* Payment Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Amount *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-600 dark:text-gray-400 font-semibold">
                  ₱
                </span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  min="1"
                  step="1"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Method *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <motion.label
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${
                        formData.paymentMethod === method.id
                          ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                          : "border-gray-300 dark:border-gray-600 hover:border-amber-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={handleChange}
                        className="w-4 h-4 accent-amber-500"
                      />
                      <IconComponent size={16} className="text-amber-500" />
                      <span className="text-xs font-medium">
                        {method.label}
                      </span>
                    </motion.label>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add payment notes..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-800 dark:text-white resize-none"
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || !hasPayableLoans}
                className="flex-1 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Pay Now
                  </>
                )}
              </motion.button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};
