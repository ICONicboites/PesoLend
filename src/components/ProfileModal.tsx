import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogOut, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getUser,
  clearUser,
  getDarkMode,
  setDarkMode,
} from "../services/storage";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const user = getUser();
  const [isDarkMode, setIsDarkMode] = useState(getDarkMode());

  useEffect(() => {
    setIsDarkMode(getDarkMode());
  }, []);

  const handleLogout = () => {
    clearUser();
    navigate("/");
    onClose();
  };

  const handleDarkModeToggle = () => {
    const newMode = !isDarkMode;
    setDarkMode(newMode);
    setIsDarkMode(newMode);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 w-11/12 max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:bg-amber-700 p-2 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">
                    {user?.name || "User"}
                  </h3>
                  <p className="text-amber-100 text-sm">
                    {user?.email || "No email"}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Dark Mode Toggle */}
              <motion.button
                whileHover={{ backgroundColor: "rgba(249, 115, 22, 0.1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDarkModeToggle}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  {isDarkMode ? (
                    <Moon size={20} className="text-amber-500" />
                  ) : (
                    <Sun size={20} className="text-amber-500" />
                  )}
                  <span className="text-gray-900 dark:text-white font-medium">
                    {isDarkMode ? "Dark Mode" : "Light Mode"}
                  </span>
                </div>
                <div className="w-12 h-7 bg-gray-300 dark:bg-gray-600 rounded-full p-1 flex items-center transition-colors">
                  <motion.div
                    animate={{
                      x: isDarkMode ? 20 : 0,
                      backgroundColor: isDarkMode ? "#FFD700" : "#9CA3AF",
                    }}
                    className="w-5 h-5 rounded-full transition-colors"
                  />
                </div>
              </motion.button>

              {/* Logout Button */}
              <motion.button
                whileHover={{ backgroundColor: "#DC2626" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </motion.button>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 text-center text-gray-600 dark:text-gray-400 text-xs border-t border-gray-200 dark:border-gray-600">
              PesoLend © 2025 - Version 1.0
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
