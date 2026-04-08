import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/storage";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!formData.name.trim()) {
      setError("Full name is required");
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (!formData.phone.trim()) {
      setError("Phone number is required");
      setLoading(false);
      return;
    }

    if (formData.phone.length < 10) {
      setError("Phone number must be at least 10 digits");
      setLoading(false);
      return;
    }

    if (!formData.password) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Register user
    const success = registerUser({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
    });

    if (!success) {
      setError("Email already registered. Please use a different email.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    // Redirect to login after 2 seconds
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-b border-gray-700 py-6"
      >
        <div className="container-max flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-gray-400 text-sm">
              Join PesoLend and get instant access
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
          className="w-full max-w-md space-y-6"
        >
          {/* Logo */}
          <div className="text-center">
            <div className="inline-block mb-4">
              <div className="w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">₱</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white">PesoLend</h2>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded-lg text-sm"
            >
              Account created successfully! Redirecting to login...
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Juan Dela Cruz"
                className="input-field h-12 w-full"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className="input-field h-12 w-full"
                disabled={loading}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+63 9XX XXXX XXX"
                className="input-field h-12 w-full"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="input-field h-12 w-full pr-12"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="input-field h-12 w-full pr-12"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-lg font-bold h-14 rounded-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="text-center pt-4 border-t border-gray-700">
            <p className="text-gray-400">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-amber-500 hover:text-amber-400 font-semibold transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
