import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/storage";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("test@pesolend.com");
  const [password, setPassword] = useState("Test123!");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    // Check both demo account and registered users
    if (loginUser(email, password)) {
      navigate("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col transition-colors duration-200">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-b border-gray-200 dark:border-gray-700 py-6"
      >
        <div className="container-max flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-900 dark:text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sign In
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Welcome back to PesoLend
            </p>
          </div>
        </div>
      </motion.div>

      {/* Form Container */}
      <div className="container-max flex-1 flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Logo */}
          <div className="text-center">
            <div className="inline-block mb-4">
              <div className="w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">₱</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              PesoLend
            </h2>
          </div>

          {/* Demo Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-100 px-4 py-3 rounded-lg text-sm"
          >
            <p className="font-semibold">Demo Account Pre-filled</p>
            <p className="text-amber-700 dark:text-amber-200 text-xs mt-1">
              Click Sign In to test the app
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-900 dark:text-white font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field h-12"
              />
            </div>

            <div>
              <label className="block text-gray-900 dark:text-white font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="btn-primary w-full text-lg font-bold h-14 rounded-lg mt-8"
            >
              Sign In
            </motion.button>
          </form>

          {/* Footer */}
          <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-amber-500 hover:text-amber-400 font-semibold transition-colors"
              >
                Create one
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
