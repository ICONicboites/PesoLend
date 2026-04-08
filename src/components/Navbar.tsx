import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  userName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ userName }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">₱</span>
            </div>
            <h1 className="text-2xl font-bold text-gradient">PesoLend</h1>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {userName && (
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {userName}
              </span>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 space-y-3"
            >
              {userName && (
                <p className="text-gray-700 dark:text-gray-300 px-4 font-medium">
                  {userName}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
