import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, Phone, Mail, ChevronDown } from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: 1,
    question: "How do I apply for a loan?",
    answer: "To apply for a loan, go to your Dashboard and click the 'Apply for Loan' button. Fill in the loan amount (minimum ₱1,000), duration (1-60 months), and submit. Your loan will be reviewed and either approved or rejected.",
  },
  {
    id: 2,
    question: "What is the maximum loan amount I can apply for?",
    answer: "The maximum loan amount depends on your available credit limit, which is calculated based on your current loans and payment history. You can check your available credit on the Dashboard.",
  },
  {
    id: 3,
    question: "How long does it take to get a loan approved?",
    answer: "Loan applications are processed instantly. You'll see the approval or rejection status immediately after submission. Once approved, the funds are available for payment.",
  },
  {
    id: 4,
    question: "What payment methods are available?",
    answer: "We accept multiple payment methods including Credit Card, Debit Card, Bank Transfer, and E-Wallet. You can select your preferred payment method when making a payment.",
  },
  {
    id: 5,
    question: "Can I pay my loan early?",
    answer: "Yes, you can pay your loan at any time. There are no early payment penalties. Your available credit will be updated immediately after payment.",
  },
  {
    id: 6,
    question: "How do I check my transaction history?",
    answer: "Click the 'Activity' button in the bottom navigation to view your complete transaction history with all disbursements and payments.",
  },
  {
    id: 7,
    question: "Is my account information secure?",
    answer: "Yes, your data is stored securely in your browser's local storage. We recommend keeping your login credentials confidential and logging out after each session.",
  },
  {
    id: 8,
    question: "How do I reset my password?",
    answer: "Currently, you'll need to contact our support team to reset your password. Please provide your registered email address.",
  },
];

export const SupportPage = () => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10"
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-700 dark:text-gray-300" />
          </motion.button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Help & Support
          </h1>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Support Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {/* Contact Support */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card flex flex-col items-center text-center hover:shadow-lg transition-shadow"
          >
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <MessageCircle size={28} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
              Chat Support
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow">
              Get instant help from our support team
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary w-full text-sm"
            >
              Start Chat
            </motion.button>
          </motion.div>

          {/* Call Support */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card flex flex-col items-center text-center hover:shadow-lg transition-shadow"
          >
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <Phone size={28} className="text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
              Call Us
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow">
              Available 24/7 for phone support
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary w-full text-sm"
            >
              1-800-PESOLEND
            </motion.button>
          </motion.div>

          {/* Email Support */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card flex flex-col items-center text-center hover:shadow-lg transition-shadow"
          >
            <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
              <Mail size={28} className="text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
              Email Support
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow">
              Send us a detailed message
            </p>
            <motion.a
              href="mailto:support@pesolend.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary w-full text-sm"
            >
              Email Us
            </motion.a>
          </motion.div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Find answers to common questions about PesoLend
            </p>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
              >
                <motion.button
                  onClick={() =>
                    setExpandedId(expandedId === item.id ? null : item.id)
                  }
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <span className="text-left font-semibold text-gray-800 dark:text-white">
                    {item.question}
                  </span>
                  <motion.div
                    animate={{ rotate: expandedId === item.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={20} className="text-gray-500" />
                  </motion.div>
                </motion.button>

                <motion.div
                  initial={false}
                  animate={{ height: expandedId === item.id ? "auto" : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="px-4 py-4 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30">
                    {item.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Documentation Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 card text-center"
        >
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
            Need More Help?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Check our complete documentation for detailed guides and tutorials
          </p>
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Read Documentation
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};
