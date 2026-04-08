import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Lock, Zap } from "lucide-react";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: "Instant Approval",
      subtitle: "Know your status instantly",
    },
    {
      icon: Lock,
      title: "Secure & Private",
      subtitle: "Your data is safe with us",
    },
    {
      icon: CheckCircle,
      title: "Flexible Terms",
      subtitle: "Repayment options that work for you",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col pb-20">
      {/* Container */}
      <div className="container-max flex-1 flex flex-col justify-center py-20">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-6">
            <div className="w-20 h-20 bg-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-900">₱</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">PesoLend</h1>
          <p className="text-gray-300 text-xl max-w-lg mx-auto leading-relaxed">
            Fast, secure cash and flexible lending. Get the funds you need with
            flexible repayment terms.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4 mb-16"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                className="flex items-center gap-4 p-5 bg-gray-800 rounded-lg border border-gray-700 hover:border-orange-500 transition-colors"
              >
                <CheckCircle
                  size={24}
                  className="text-green-500 flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="text-white font-bold text-lg">
                    {feature.title}
                  </p>
                  <p className="text-gray-400">{feature.subtitle}</p>
                </div>
                <Icon size={28} className="text-orange-500 flex-shrink-0" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-4"
        >
          <button
            onClick={() => navigate("/register")}
            className="btn-primary w-full text-xl font-bold py-4 h-14 rounded-lg"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/login")}
            className="btn-secondary w-full text-xl font-bold py-4 h-14 rounded-lg"
          >
            Sign In
          </button>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center py-6 text-gray-500 text-sm border-t border-gray-700"
      >
        <p>&copy; 2024 PesoLend. All rights reserved.</p>
      </motion.div>
    </div>
  );
};

export default LandingPage;
